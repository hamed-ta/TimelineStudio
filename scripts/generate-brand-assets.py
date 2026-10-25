#!/usr/bin/env python3
"""Regenerate committed web icons from the approved SVGs. Requires rsvg-convert."""

import json
from pathlib import Path
import struct
import subprocess
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
BRAND = PUBLIC / "brand"
NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)


def body(name):
    root = ET.parse(BRAND / name).getroot()
    return "\n".join(ET.tostring(e, encoding="unicode").strip() for e in root if e.tag != f"{{{NS}}}title")


def write_svg(path, content, width=256, height=256):
    path.write_text(
        f'<svg xmlns="{NS}" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="Timeline Studio">'
        f'<title>Timeline Studio</title>{content}</svg>\n'
    )


def render(source, target, width, height):
    subprocess.run(["rsvg-convert", "-w", str(width), "-h", str(height), "-o", str(target), str(source)], check=True)


def tile(scale):
    inset = 128 * (1 - scale)
    return (
        '<rect width="256" height="256" fill="#05060f"/>'
        f'<g transform="translate({inset:g} {inset:g}) scale({scale:g})">{body("symbol-dark.svg")}</g>'
    )


light = ET.parse(BRAND / "symbol-light.svg").getroot()
path = next(e for e in light if e.tag == f"{{{NS}}}path").attrib["d"]
write_svg(PUBLIC / "favicon.svg", (
    '<style>.body{fill:#426b64}.moment{fill:#996c36}'
    '@media(prefers-color-scheme:dark){.body{fill:#a4cbbb}.moment{fill:#e6bb7e}}</style>'
    f'<path class="body" d="{path}"/><circle class="moment" cx="212" cy="104" r="16"/>'
))
write_svg(BRAND / "icon.svg", tile(.82))
write_svg(BRAND / "icon-maskable.svg", tile(.60))
write_svg(BRAND / "favicon-fallback.svg", tile(1))
write_svg(BRAND / "social-card.svg", (
    '<rect width="1200" height="630" fill="#05060f"/>'
    f'<svg x="230" y="182" width="740" height="267" viewBox="0 0 710 256">{body("lockup-dark.svg")}</svg>'
), 1200, 630)

for size in (16, 32, 48):
    render(BRAND / "favicon-fallback.svg", BRAND / f"favicon-{size}.png", size, size)
for size in (192, 512):
    render(BRAND / "icon.svg", BRAND / f"icon-{size}.png", size, size)
render(BRAND / "icon-maskable.svg", BRAND / "icon-maskable-512.png", 512, 512)
render(BRAND / "icon.svg", PUBLIC / "apple-touch-icon.png", 180, 180)
render(BRAND / "social-card.svg", BRAND / "social-card.png", 1200, 630)

# ICO directories support PNG payloads, avoiding an additional image dependency.
images = [(size, (BRAND / f"favicon-{size}.png").read_bytes()) for size in (16, 32, 48)]
offset = 6 + 16 * len(images)
entries = []
for size, data in images:
    entries.append(struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset))
    offset += len(data)
(PUBLIC / "favicon.ico").write_bytes(struct.pack("<HHH", 0, 1, len(images)) + b"".join(entries) + b"".join(data for _, data in images))

manifest = {
    "id": "./", "name": "Timeline Studio", "short_name": "Timeline Studio",
    "start_url": "./", "scope": "./", "display": "standalone",
    "theme_color": "#05060f", "background_color": "#05060f",
    "icons": [
        {"src": "brand/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": "brand/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": "brand/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}
(PUBLIC / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")
print("Generated favicon, home-screen icons, manifest, and social card from public/brand SVG artwork.")
