#!/usr/bin/env python3
"""
Fetch profile photos for CRIYPT researchers from their webpages.

Strategy:
  1. Collect ALL candidate images from the page (og:image, twitter:image, selectors)
  2. Score each candidate:
       + face detected via OpenCV Haar cascade  (+30)
       + URL/alt contains photo/portrait/profile (+10)
       + square or portrait aspect ratio         (+5)
       + reasonable size (100-500 px)            (+5)
       - URL/alt contains logo/seal/banner/icon  (-20)
       - very wide (banner)                      (-15)
       - very small (icon < 80px)               (-10)
  3. Pick the highest-scoring candidate above threshold
  4. Resize to max 300×300 and save as JPEG

Saves to:  assets/images/people/{slug}.jpg
Updates:   _data/names-people.yml  (adds 'photo' field, preserves formatting)
"""

import io
import re
import sys
import httpx
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urljoin, urlparse
from ruamel.yaml import YAML as RuamelYAML

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

try:
    import cv2
    import numpy as np
    _cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    _face_cascade = cv2.CascadeClassifier(_cascade_path)
    HAS_CV2 = True
except Exception:
    HAS_CV2 = False

OUTPUT_DIR = Path("assets/images/people")
DATA_FILE  = Path("_data/names-people.yml")
PHOTO_BASE = "/assets/images/people/"
MAX_PX     = 300
JPEG_Q     = 85
MIN_SCORE  = 0          # minimum score to accept an image
MAX_CANDIDATES = 12     # max images to evaluate per person

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# Positive URL/alt keywords → likely a person photo
_PHOTO_WORDS   = {"photo", "portrait", "headshot", "profile", "avatar", "pic", "face", "person"}
# Negative URL/alt keywords → likely NOT a person photo
_NONPHOTO_WORDS = {
    "logo", "seal", "banner", "icon", "header", "footer", "background",
    "campus", "building", "map", "flag", "coat", "emblem", "symbol",
    "lab", "group", "team", "department", "school", "college",
    "university", "institute", "centre", "center",
}

# CSS selectors to try — more specific first
PROFILE_SELECTORS = [
    # Direct profile/bio photo classes
    "img.profile-photo", "img.bio-photo", "img.profile-image",
    "img.profile-pic", "img.profile_photo", "img.faculty-photo",
    "img.staff-photo", "img.researcher-photo", "img.author-photo",
    # Container + img
    ".profile-photo img", ".bio-photo img", ".profile img",
    ".faculty-photo img", ".staff-photo img", ".bio img",
    ".author-photo img", ".team-member img", ".person-photo img",
    # Generic avatar
    "img.avatar", "img[class*='avatar']", "img[class*='profile']",
    # Alt text hints
    "img[alt*='profile']", "img[alt*='photo']", "img[alt*='portrait']",
    # ResearchGate
    "img.nova-legacy-e-avatar__image",
    "img[itemprop='image']",
    ".research-interest-card--profile img",
    # ORCID, academia.edu
    "img.profile-picture", "img#profile-picture",
    # Institutional pages
    "img.wp-post-image", ".entry-content img:first-of-type",
]


# ── YAML helpers ──────────────────────────────────────────────────────────────

def load_yaml(path):
    ry = RuamelYAML()
    ry.preserve_quotes = True
    with open(path) as f:
        return ry.load(f), ry

def save_yaml(path, data, ry):
    with open(path, "w") as f:
        ry.dump(data, f)


# ── Utilities ─────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

def _keywords(text: str) -> set[str]:
    return {w.lower() for w in re.split(r"[/_\-. ]", text) if w}


# ── Candidate collection ──────────────────────────────────────────────────────

@dataclass
class Candidate:
    url: str
    alt: str = ""
    width: int = 0
    height: int = 0
    raw: bytes = field(default_factory=bytes, repr=False)
    score: int = 0


def _collect_candidates(page_url: str, soup) -> list[Candidate]:
    """Return all plausible image candidates from the page."""
    seen: set[str] = set()
    candidates: list[Candidate] = []

    def _add(img_url: str, alt: str = ""):
        abs_url = urljoin(page_url, img_url)
        if abs_url in seen:
            return
        # Skip tiny icons / data URIs / SVGs
        if img_url.startswith("data:") or img_url.endswith(".svg"):
            return
        seen.add(abs_url)
        candidates.append(Candidate(url=abs_url, alt=alt or ""))

    # og:image / twitter:image first
    for meta_prop in (("property", "og:image"), ("name", "twitter:image"),
                      ("property", "og:image:secure_url")):
        tag = soup.find("meta", {meta_prop[0]: meta_prop[1]})
        if tag and tag.get("content"):
            _add(tag["content"])

    # CSS selector matches
    for sel in PROFILE_SELECTORS:
        for img in soup.select(sel):
            src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
            if src:
                _add(src, img.get("alt", ""))

    return candidates[:MAX_CANDIDATES]


# ── Scoring ───────────────────────────────────────────────────────────────────

def _has_face(raw: bytes) -> bool:
    if not HAS_CV2 or not raw:
        return False
    try:
        arr = np.frombuffer(raw, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return False
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = _face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        return len(faces) > 0
    except Exception:
        return False


def _score(c: Candidate) -> int:
    score = 0
    url_words = _keywords(urlparse(c.url).path)
    alt_words  = _keywords(c.alt)
    all_words  = url_words | alt_words

    # Keyword signals
    if all_words & _PHOTO_WORDS:
        score += 10
    if all_words & _NONPHOTO_WORDS:
        score -= 20

    # Dimension / aspect ratio signals
    w, h = c.width, c.height
    if w > 0 and h > 0:
        ratio = w / h
        if 0.65 <= ratio <= 1.55:   # square / portrait
            score += 5
        if ratio > 3.0:              # banner
            score -= 15
        if max(w, h) < 80:          # tiny icon
            score -= 10
        if 80 <= min(w, h) <= 600:  # reasonable profile size
            score += 5

    # Face detection (most reliable signal)
    if _has_face(c.raw):
        score += 30

    return score


# ── Download + resolve ────────────────────────────────────────────────────────

def _download(url: str, client: httpx.Client) -> bytes | None:
    try:
        r = client.get(url, timeout=20, follow_redirects=True)
        r.raise_for_status()
        ct = r.headers.get("content-type", "")
        if not ct.startswith("image/"):
            return None
        return r.content or None
    except Exception:
        return None


def _image_size(raw: bytes) -> tuple[int, int]:
    if not HAS_PIL or not raw:
        return 0, 0
    try:
        img = Image.open(io.BytesIO(raw))
        return img.size  # (width, height)
    except Exception:
        return 0, 0


def _save(raw: bytes, dest: Path) -> bool:
    if not raw:
        return False
    try:
        if HAS_PIL:
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
            img.save(dest, "JPEG", quality=JPEG_Q, optimize=True)
        else:
            dest.write_bytes(raw)
        return True
    except Exception as e:
        print(f"    save error: {e}")
        return False


# ── Main fetch logic ──────────────────────────────────────────────────────────

def best_photo(page_url: str, client: httpx.Client) -> bytes | None:
    """Return raw bytes of the best profile photo found on *page_url*, or None."""
    try:
        r = client.get(page_url, timeout=20, follow_redirects=True)
        r.raise_for_status()
    except Exception as e:
        print(f"    page fetch failed: {e}")
        return None

    if not HAS_BS4:
        print("    beautifulsoup4 not installed")
        return None

    soup = BeautifulSoup(r.text, "html.parser")
    candidates = _collect_candidates(page_url, soup)

    if not candidates:
        print("    no candidate images found")
        return None

    print(f"    evaluating {len(candidates)} candidate(s)...")

    scored: list[tuple[int, Candidate]] = []
    for c in candidates:
        raw = _download(c.url, client)
        if not raw:
            continue
        c.raw = raw
        c.width, c.height = _image_size(raw)
        c.score = _score(c)
        scored.append((c.score, c))
        face_marker = "👤" if _has_face(raw) else "  "
        print(f"    {face_marker} score={c.score:+3d}  {c.url[:80]}")

    if not scored:
        print("    no downloadable images found")
        return None

    scored.sort(key=lambda x: x[0], reverse=True)
    best_score, best = scored[0]

    if best_score < MIN_SCORE:
        print(f"    best score {best_score} below threshold {MIN_SCORE} — skipping")
        return None

    print(f"    ✅ selected (score={best_score}): {best.url[:80]}")
    return best.raw


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    people, ryaml = load_yaml(DATA_FILE)
    changed = []

    cv2_status = "✓ face detection on" if HAS_CV2 else "✗ face detection off (install opencv-python-headless)"
    print(f"OpenCV: {cv2_status}\n")

    with httpx.Client(headers=HEADERS, timeout=25) as client:
        for person in people:
            name    = person.get("name", "").strip()
            webpage = (person.get("webpage") or "").strip()

            if person.get("photo"):
                print(f"SKIP  {name}  (photo already set)")
                continue

            if not webpage or webpage in ("_No response_", "null", ""):
                print(f"SKIP  {name}  (no webpage)")
                continue

            print(f"\n→ {name}")
            print(f"  {webpage}")

            raw = best_photo(webpage, client)
            if not raw:
                continue

            slug = slugify(name)
            dest = OUTPUT_DIR / f"{slug}.jpg"

            if _save(raw, dest):
                person["photo"] = f"{PHOTO_BASE}{slug}.jpg"
                changed.append(name)
            else:
                print(f"    ❌ could not save image")

    if changed:
        save_yaml(DATA_FILE, people, ryaml)
        print(f"\nSaved photos for: {', '.join(changed)}")
        return 0

    print("\nNo photos saved.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
