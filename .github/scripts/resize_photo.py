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
import ipaddress
import socket
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image

MAX_PX = 300
JPEG_Q = 85
MAX_REDIRECTS = 5

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
}


# ── SSRF guard ────────────────────────────────────────────────────────────────
# `url` is a submitted Photo URL field — nothing stops a submitter from
# pointing it at internal infrastructure (the cloud metadata endpoint,
# localhost, a private-network service) instead of a real public image.
# Reject anything whose scheme isn't http(s) or whose hostname resolves to
# a private/loopback/link-local/reserved address, and re-check on every
# redirect hop too (a same-origin-looking URL can still 302 to an internal
# address once fetched).

def _is_public_ip(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
    except ValueError:
        return False
    # Treat an IPv4-mapped IPv6 address (::ffff:127.0.0.1) as its mapped
    # IPv4 form — `is_loopback`/`is_private` on the IPv6 wrapper itself
    # wouldn't otherwise catch it.
    if isinstance(ip, ipaddress.IPv6Address) and ip.ipv4_mapped is not None:
        ip = ip.ipv4_mapped
    return not (
        ip.is_private or ip.is_loopback or ip.is_link_local
        or ip.is_multicast or ip.is_reserved or ip.is_unspecified
    )


def is_safe_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        return False
    try:
        infos = socket.getaddrinfo(parsed.hostname, None)
    except socket.gaierror:
        return False
    resolved = {info[4][0] for info in infos}
    return bool(resolved) and all(_is_public_ip(ip) for ip in resolved)


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    max_redirections = MAX_REDIRECTS

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not is_safe_url(newurl):
            raise urllib.error.URLError(f"refusing to follow redirect to unsafe URL: {newurl}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: resize_photo.py <url> <dest_path>", file=sys.stderr)
        return 1

    url, dest = sys.argv[1], sys.argv[2]

    if not is_safe_url(url):
        print("URL must be http(s) and resolve to a public address", file=sys.stderr)
        return 1

    try:
        opener = urllib.request.build_opener(SafeRedirectHandler)
        req = urllib.request.Request(url, headers=HEADERS)
        with opener.open(req, timeout=20) as resp:
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
