#!/usr/bin/env python3
"""
Fetch profile photos for CRIYPT researchers from their webpages.

Strategy (in order of preference):
  1. og:image meta tag
  2. twitter:image meta tag
  3. Common profile photo CSS selectors
  4. First <img> near the person's name in the page

Saves to:  assets/images/people/{slug}.jpg   (always JPEG, max 300x300)
Updates:   _data/names-people.yml            (adds 'photo' field)
"""

import io
import re
import sys
import httpx
import yaml
from pathlib import Path
from urllib.parse import urljoin, urlparse

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

OUTPUT_DIR  = Path("assets/images/people")
DATA_FILE   = Path("_data/names-people.yml")
PHOTO_BASE  = "/assets/images/people/"
MAX_PX      = 300   # resize to at most 300×300
JPEG_Q      = 85

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# CSS selectors tried in order
PROFILE_SELECTORS = [
    "img.profile-photo", "img.bio-photo", "img.profile-image",
    "img.profile-pic", "img.profile_photo", "img.faculty-photo",
    "img.staff-photo", "img.researcher-photo", "img.avatar",
    ".profile-photo img", ".bio-photo img", ".profile img",
    ".faculty-photo img", ".staff-photo img", ".bio img",
    ".author-photo img", ".team-member img", ".person img",
    "img[class*='profile']", "img[class*='avatar']",
    "img[alt*='profile']", "img[alt*='photo']", "img[alt*='portrait']",
]


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def find_image_url(page_url: str, client: httpx.Client) -> str | None:
    """Return the best candidate profile image URL from *page_url*, or None."""
    try:
        r = client.get(page_url, timeout=20, follow_redirects=True)
        r.raise_for_status()
    except Exception as exc:
        print(f"    fetch failed: {exc}")
        return None

    if not HAS_BS4:
        print("    beautifulsoup4 not installed")
        return None

    soup = BeautifulSoup(r.text, "html.parser")

    # 1. og:image
    tag = soup.find("meta", property="og:image")
    if tag and tag.get("content"):
        return urljoin(page_url, tag["content"])

    # 2. twitter:image
    tag = soup.find("meta", attrs={"name": "twitter:image"})
    if tag and tag.get("content"):
        return urljoin(page_url, tag["content"])

    # 3. Common selectors
    for sel in PROFILE_SELECTORS:
        img = soup.select_one(sel)
        if img and img.get("src"):
            return urljoin(page_url, img["src"])

    return None


def download_and_save(img_url: str, dest: Path, client: httpx.Client) -> bool:
    """Download *img_url*, resize, save as JPEG to *dest*. Returns True on success."""
    try:
        r = client.get(img_url, timeout=25, follow_redirects=True)
        r.raise_for_status()
    except Exception as exc:
        print(f"    download failed: {exc}")
        return False

    ct = r.headers.get("content-type", "")
    if not ct.startswith("image/"):
        print(f"    not an image (content-type: {ct})")
        return False

    raw = r.content
    if not raw:
        print("    empty response")
        return False

    if HAS_PIL:
        try:
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
            img.save(dest, "JPEG", quality=JPEG_Q, optimize=True)
            return True
        except Exception as exc:
            print(f"    PIL error: {exc}")
            # fall through to raw save

    # Raw save (no resize)
    dest.write_bytes(raw)
    return True


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    raw = DATA_FILE.read_text(encoding="utf-8")
    people: list[dict] = yaml.safe_load(raw)

    changed = []

    with httpx.Client(headers=HEADERS, timeout=20) as client:
        for person in people:
            name    = person.get("name", "").strip()
            webpage = (person.get("webpage") or "").strip()

            if person.get("photo"):
                print(f"  SKIP  {name}  (photo already set)")
                continue

            if not webpage or webpage in ("_No response_", "null", ""):
                print(f"  SKIP  {name}  (no webpage)")
                continue

            print(f"  {name}  →  {webpage}")

            img_url = find_image_url(webpage, client)
            if not img_url:
                print(f"    no image found")
                continue

            slug = slugify(name)
            dest = OUTPUT_DIR / f"{slug}.jpg"

            if download_and_save(img_url, dest, client):
                person["photo"] = f"{PHOTO_BASE}{slug}.jpg"
                changed.append(name)
                print(f"    ✅  saved → {dest}")
            else:
                print(f"    ❌  could not save image")

    if changed:
        DATA_FILE.write_text(
            yaml.dump(people, default_flow_style=False, allow_unicode=True,
                      sort_keys=False),
            encoding="utf-8",
        )
        print(f"\nUpdated {DATA_FILE} for: {', '.join(changed)}")
        return 0
    else:
        print("\nNo photos fetched.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
