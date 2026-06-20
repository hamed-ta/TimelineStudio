# Closeup Workflow

Use this workflow before ending a meaningful work session or when the user says `/closeup`.

1. Run relevant verification.
   - Always run `node --check app.js` after JavaScript changes.
   - Run `docs/workflows/browser-smoke.md` checks after UI behavior changes.
2. Check repository status with `git status --short`.
3. Update `docs/handoff.md`.
4. Update `docs/plan.md` if priorities or task status changed.
5. Update `docs/product.md` if intended user-visible behavior changed.
6. Add an ADR in `docs/adr/` only if a lasting decision was made.
7. Commit only when the user asks.

The handoff must include:
- work completed
- files changed
- checks run
- known issues
- uncommitted work
- next safe step
