# Handoff

## Current Goal

Continue the ADR 0009 migration by moving undo/redo history ownership into reducer-managed editor state.

## Completed Work

- Stabilized cursor-readout layout and default line identities, including six lines named top-to-bottom that keep their names when moved.
- Centered responsive timeline bounds, fixed add-line clipping, extended alternating bands through resized canvas space, and preserved directional item overflow.

## Files Changed

- Timeline behavior: `src/features/timeline-editor/legacyTimelineEditor.js`, `timelineInfo.ts`, `layout/timelineLayout.ts`, `canvas/TimelineCanvas.tsx`, and `styles.css`.
- Defaults and tests: `src/timeline/model.ts` plus focused model, info, and layout tests.
- Product/process: `docs/product.md`, `docs/workflows/browser-smoke.md`, `docs/plan.md`, `CHANGELOG.md`, and this handoff.

## Checks Run

- `npm test` passed 113 tests.
- `node --check src/features/timeline-editor/legacyTimelineEditor.js` passed.
- `npm run typecheck` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke passed in the in-app browser: symmetric grow/shrink behavior, immediate full-height bands, centered scrolling, directional note overflow, and no console errors.

## Known Issues

- ResizeObserver-driven layout behavior has browser-smoke coverage but no automated browser harness.

## Uncommitted Work

- Cursor-readout stabilization, stable six-line defaults, responsive centered canvas behavior, and supporting tests/docs are uncommitted.

## Suggested Commit Message

`fix: stabilize timeline labels and responsive canvas layout`

## Next Safe Step

- Add failing reducer tests for history ownership, then integrate the existing `history.ts` primitives into `TimelineEditorState` without switching the legacy runtime source of truth prematurely.
