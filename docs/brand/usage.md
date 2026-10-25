# Timeline Studio — logo usage

Approved 2026-10-25: **Gentle turn, Sage + amber**. A rounded t and a separate moment identify a calm, personal timeline workspace.

| Use | t | Moment | Name / background |
| --- | --- | --- | --- |
| Daylight | `#426b64` | `#996c36` | `#17243b` on white / `#eef2f8` |
| Midnight | `#a4cbbb` | `#e6bb7e` | `#d8ecf8` on `#05060f` |
| One colour | One solid ink throughout | Same ink | Black on light, white on dark |

These are RGB web colours. Use the supplied one-colour master for single-ink work; print/spot-colour matching has not been proofed.

**Masters:** `public/brand/symbol-light.svg`, `symbol-dark.svg`, `symbol-black.svg`, `symbol-white.svg`, `lockup-light.svg`, and `lockup-dark.svg`. Lockup type is outlined from the project's OFL-licensed Space Grotesk, so display does not depend on installed fonts. The live app uses the same mark with an accessible text name in Space Grotesk.

**Spacing and size:** retain at least one dot diameter of clear space beyond the artwork's bounds. Keep symbol drawings at least 16px square and outlined lockups at least 160px wide. App header/footer use 36px/22px SVG canvases. Favicon and icon exports use their purpose-built padding; do not add the general clear space inside them again.

**Backgrounds:** use the appropriate light/dark artwork on quiet solid surfaces. Use the supplied opaque midnight icon tile for home-screen icons. The maskable icon keeps its artwork inside the safe zone. On busy imagery, place the mark on a quiet solid field first. Forced colours may use a single system text colour.

**Keep:** the relative dot size, its gap from the t, the curve, aspect ratio, and the supplied lockup spacing. Avoid stretching, rotation, extra outlines, gradients, shadows, moving the dot, colouring the wordmark with the symbol colours, or putting the light artwork on midnight. Brand colours do not replace control accents or user-selected timeline colours.

**Web use:** the app shares one `BrandMark` component. `favicon.svg` follows the browser's colour-scheme preference independently of the app's saved theme; the ICO fallback and home-screen icons use the midnight tile. Manifest/icon URLs are relative to the Vite base path. The manifest supplies home-screen metadata; it adds no offline cache or service worker. The social card is a 1200×630 PNG of the outlined dark lockup.

**Regeneration:** keep the geometry in `BrandMark.tsx` and the symbol masters aligned. Run `python3 scripts/generate-brand-assets.py` after editing the approved SVG masters; this optional local authoring command requires `rsvg-convert`, not a new app/runtime dependency. Re-embed raster origin metadata with Impeccable's `embed-prompt` tool after regeneration, then check the icon sizes and the built `/TimelineStudio/` asset paths. ICO content comes from the three favicon PNGs. All generated art derives from the approved vectors; no image generation or stock imagery is involved.
