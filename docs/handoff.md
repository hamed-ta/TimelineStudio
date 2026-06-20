# Handoff

## Current Goal

Apply a modern light/dark visual theme with a UI switcher while preserving existing timeline behavior.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet now uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`51a6453 refactor: extract timeline formatters`

## Work Completed This Session

- Researched current design-system color guidance.
- Added system light/dark theme tokens in `styles.css`.
- Added a single System/Light/Dark cycling theme button in the React shell.
- Restyled app surfaces, controls, form fields, focus states, and timeline SVG colors through semantic CSS variables.
- Updated live SVG note labels to inherit theme-aware CSS colors.
- Updated product notes with system theme and saved preference behavior.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `app.js`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`
- `index.html`
- `src/App.tsx`
- `styles.css`

## Decisions

- Keep this slice behavior-preserving; no data, DOM hook, or Firebase changes.
- Use CSS variables and `prefers-color-scheme` instead of adding a component/theme dependency.
- Store only the UI theme preference in local storage; do not write theme preferences into timeline JSON.
- Preserve all IDs and `data-*` hooks used by legacy `app.js`.

## Verification

- `git diff --check`: passed.
- `node --check app.js`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke through Vite at `http://127.0.0.1:8765/`: app loaded with no console errors.
- Browser smoke: single theme button cycled System -> Light -> Dark -> System, Light and Dark changed rendered theme variables, and Dark persisted across reload.
- Browser smoke: created an event, entered `2026-02-03`, applied the item form, and clicked Save JSON; status changed to `JSON saved`.
- Browser smoke: 390px mobile viewport had no horizontal overflow and the theme button remained readable.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`style: add light and dark theme switcher`

## Next Safe Step

If the theme is accepted, start the next small UI polish slice, preserving IDs and data attributes used by `app.js`.
