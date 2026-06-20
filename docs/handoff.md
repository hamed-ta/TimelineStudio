# Handoff

## Current Goal

Update dependency policy docs before continuing larger UI layout work.

## Last Known State

Timeline Studio has a Vite, React, and TypeScript shell. The existing legacy `app.js` timeline engine still owns rendering, DOM events, pan, zoom, fit, lock state, and line renaming.

Typed helper modules own timeline model, dates, formatters, JSON, PDF, SVG export, file, and media helpers.

The stylesheet uses semantic design tokens for light and dark color schemes. The app has a single cycling System/Light/Dark theme button that stores Light/Dark overrides in browser local storage and leaves timeline JSON unchanged.

The project no longer treats dependency-free status as absolute. ADR 0006 allows reasonable dependencies when they materially improve accessibility, reliability, maintainability, or complex feature behavior, with documentation requirements based on scope.

Versioning/changelog guidance is documented in `docs/versioning.md` and `CHANGELOG.md`. The package version remains `0.1.0`.

The app starts with empty data. Personal timeline JSON files are local user data and are stored under ignored `user-data/`.

Firebase should wait until the local Vite app is stable.

## Last Commit

`51a6453 refactor: extract timeline formatters`

## Work Completed This Session

- Added layout behavior scenarios for a movable/collapsible editor sidebar and timeline toolbar.
- Added ADR 0006 for dependency policy.
- Updated `AGENTS.md` so future work may add justified dependencies.
- Updated `CHANGELOG.md`, plan, and handoff docs.

## Files Changed

- `CHANGELOG.md`
- `AGENTS.md`
- `docs/adr/0006-dependency-policy.md`
- `docs/handoff.md`
- `docs/plan.md`
- `docs/product.md`

## Decisions

- Keep this slice documentation-only; no runtime dependency has been added.
- Reasonable dependencies are allowed when justified by feature value, but broad/cross-cutting choices need an ADR.
- Preserve all IDs and `data-*` hooks used by legacy `app.js` when the layout implementation resumes.

## Verification

- `git diff --check`: passed.
- Runtime checks not required for documentation-only dependency policy update.

## Open Issues

- No automated browser test harness exists yet.
- Manual JSON load verification is still needed in the Vite app because the available browser automation surface did not expose file upload.
- Firebase is not installed or configured yet.
- Rendering and interaction behavior still lives in legacy `app.js`.
- `npm audit` reports one low-severity transitive `esbuild` advisory for Windows dev-server use.

## Suggested Commit Message

`docs: add dependency policy`

## Next Safe Step

Resume the movable/collapsible sidebar and toolbar UI slice. Consider a small dependency only if it materially improves accessibility or avoids fragile custom behavior.
