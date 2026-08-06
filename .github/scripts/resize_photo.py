#!/usr/bin/env python3
"""
Downloads a single, directly-linked image and resizes it to the site's
photo convention, for the Edit My Profile automation's Photo URL field.

Unlike fetch_photos.py — which scrapes a person's *webpage* and scores
several candidate images to pick the most likely headshot — this script
takes a URL the researcher already pointed at directly, so there's no
candidate scoring to do. It exists so a submitted photo lands in the repo
as a local, optimized file (matching every other photo on the site)
instead of a live hotlink to whatever server happens to host it, which
can go away, get hotlink-protected, or be arbitrarily large/unoptimized.

MAX_PX / JPEG_Q intentionally match fetch_photos.py — keep them in sync.

Usage: resize_photo.py <url> <dest_path>
Exits non-zero with a message on stderr if the URL can't be fetched or
doesn't decode as an image.
"""

import io
import sys
import urllib.request
from pathlib import Path

from PIL import Image

MAX_PX = 300
JPEG_Q = 85

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
}


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: resize_photo.py <url> <dest_path>", file=sys.stderr)
        return 1

    url, dest = sys.argv[1], sys.argv[2]

    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read()
    except Exception as e:
        print(f"could not fetch URL: {e}", file=sys.stderr)
        return 1

    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as e:
        print(f"not a valid image: {e}", file=sys.stderr)
        return 1

    img.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)

    dest_path = Path(dest)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest_path, "JPEG", quality=JPEG_Q, optimize=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
