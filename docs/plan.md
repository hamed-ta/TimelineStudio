# Plan

## Current Goal

Make Timeline Studio easier to develop with coding agents through small behavior-first iterations.

## Current Slice

Set up the agentic development workflow documents.

## Now

- Review the workflow documentation changes.
- Commit the workflow documentation changes if requested.

## Next

- Add a lightweight automated browser test harness when the user wants true test-first red/green UI checks.
- Add validation for malformed imported JSON.
- Add a visible unsaved-change indicator.

## Later

- Add keyboard shortcuts.
- Add item color controls.
- Add richer PDF export options.
- Add Playwright tests for save/load, pan, zoom, lock, fit, and export flows.

## Done Recently

- Removed default sample data.
- Added save picker with download fallback.
- Added fit button.
- Added lock state.
- Added Iranian date labels in English words and numbers.
- Fixed `AGENTS.md` so it is complete and parseable.
- Added missing workflow files referenced by `AGENTS.md`.
- Turned `docs/handoff.md` into a real current-state handoff.
- Added initial ADRs for decisions already made.

## Risks

- Browser file picker support varies.
- Export behavior may differ across browsers.
- Manual testing is still doing work that automated browser tests should eventually cover.
- Workflow docs can drift if `/closeup` is not used consistently.

## Verification Checklist

- `node --check app.js`
- App loads at `http://127.0.0.1:8765/index.html`
- Create event
- Create period
- Rename line
- Pan by dragging
- Zoom in/out
- Fit timeline
- Save JSON
- Load JSON
- Export SVG/PNG/PDF
