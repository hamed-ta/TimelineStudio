# Handoff

## Current Goal

Set up a lightweight agentic development workflow for Timeline Studio.

## Last Known State

Timeline Studio is a static web app with timeline pan, zoom, fit, lock state, line renaming, JSON save/load, and SVG/PNG/PDF export.

The app starts with empty data. Personal timeline JSON files are local user data and should not be treated as default seed data.

## Last Commit

`c1adfc7 Add JSON save picker`

## Decisions

- Keep the app as a dependency-free static web app for now.
- Use JSON as the primary save/load format.
- Store dates internally as Gregorian ISO dates and derive Iranian date labels for display.
- Use BDD plus red/green/refactor for behavior changes.
- Keep detailed red/green/refactor instructions in `docs/workflows/red-green-refactor.md`; keep `AGENTS.md` as a concise rule and pointer.
- Use `/startup` and `/closeup` as session-boundary workflows.

## Verification

- `node --check app.js`: passed.
- Documentation reference sanity check completed with `rg`.
- `AGENTS.md` now points to `docs/workflows/red-green-refactor.md` instead of duplicating the full workflow.

## Open Issues

- No automated browser test harness exists yet.
- Browser smoke checks are manual until a test harness such as Playwright is added.
- `personal-timeline.json` files appear to be local user data and are currently untracked.

## Next Safe Step

Review and commit the workflow documentation changes if requested. After that, the next engineering improvement is adding an automated browser test harness for true red/green UI checks.
