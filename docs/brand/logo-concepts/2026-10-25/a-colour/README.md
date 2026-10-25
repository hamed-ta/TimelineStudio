# Gentle turn — colour studies

Decision: the user approved **03 Sage + amber** and requested website integration on 2026-10-25. These files preserve the studies; production masters and guidance are now `public/brand/` and `docs/brand/usage.md`.

The user selected concept A and asked to add colour. These three treatments preserve its v2 geometry and outlined Space Grotesk wordmark. **Blue hour is recommended** because it adds colour to the whole symbol while keeping the existing midnight/daylight atmosphere. Violet moment is more restrained; Sage + amber is a warmer alternative.

| Treatment | Daylight t / dot | Midnight t / dot |
| --- | --- | --- |
| Blue hour | `#536b9e` / `#805fba` | `#98c0ef` / `#c0adff` |
| Violet moment | `#17243b` / `#663af3` | `#d8ecf8` / `#c0adff` |
| Sage + amber | `#426b64` / `#996c36` | `#a4cbbb` / `#e6bb7e` |

Wordmark: existing Daylight Ink `#17243b` in light mode, Ice Highlight `#d8ecf8` in dark mode. Dark examples use Midnight Canvas `#05060f`. Blue hour's dark colours and Violet moment's colours are existing design tokens; the remaining hues are exploratory logo colours, not additions to the app's approved UI tokens.

`colour-studies.png` shows the comparison; its SVG is the presentation source and includes live labels. Each treatment has four standalone outlined SVGs: `*-symbol-light.svg`, `*-symbol-dark.svg`, `*-lockup-light.svg`, and `*-lockup-dark.svg`. Artwork is transparent; use each version on its intended background. The original black v2 files remain the one-colour reference.

Verification on 2026-10-25:

- Rendered the comparison with `rsvg-convert` and inspected the daylight/midnight drawings plus 32/16 px daylight marks.
- All twelve artwork SVGs parse, retain the source geometry, and contain no live text, strokes, rasters, gradients, or filters. Structural audits report no FAIL/WARN findings; optical-centre and outlined-type complexity notes remain informational.
- Body/dot contrast against white is 5.30/4.93 for Blue hour, 15.53/6.06 for Violet moment, and 5.97/4.61 for Sage + amber. Both components exceed 10:1 against midnight in all three dark treatments. These are legibility checks for the artwork, not app-wide accessibility claims.
- `git diff --check` passed. No app behavior, dependencies, product scenarios, or released assets changed; app tests/build were not rerun for these colour-only design artifacts.

The original study request did not approve a specific palette. The subsequent user decision selected Sage + amber; Blue hour's recommendation above is historical.
