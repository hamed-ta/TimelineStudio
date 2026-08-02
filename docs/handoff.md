# Handoff

## Current State

Selectable secondary calendars are implemented on `main`. Gregorian remains the stored main calendar; users can display Gregorian only, Gregorian plus one secondary, or one secondary calendar only.

Supported secondary calendars are Persian / Solar Hijri, Islamic / Umm al-Qura, Hebrew, Buddhist, Japanese, and Indian / Saka. Display text uses English wording and Latin digits.

## Implementation

- `src/timeline/calendars.ts` owns selection normalization, the one-secondary invariant, and control state.
- `src/timeline/calendarRegistry.ts` owns `Intl` metadata, formatting, date parts, runtime support, and non-mutating effective fallback.
- `src/timeline/calendarBoundaries.ts` derives cached month/year transitions by scanning Gregorian ISO days.
- The sidebar exposes Gregorian plus one secondary selector; unsupported options are disabled and unsupported saved selections render Gregorian with a warning without changing history or dirty state.
- The SVG renderer keeps Gregorian boundaries in dual mode and uses the selected secondary calendar for boundaries, labels, ticks, grids, day values, and bands in secondary-only mode.

## Verification

- `node --check src/features/timeline-editor/legacyTimelineEditor.js` passed.
- `npm test` passed 135/135 tests.
- `npm run typecheck` passed.
- `npm run build` passed with the existing Vite chunk-size advisory.
- `git diff --check` passed.
- 2026-08-02 browser behavior was user-confirmed working correctly; the browser family was not recorded.
- Independent task reviews found no spec-compliance or code-quality issues in the selection, registry, boundary, control, or renderer slices.

## Known Issues

- Vite reports the existing production chunk-size advisory.
- Browser behavior has manual smoke coverage but no automated browser harness.

## Next Step

Add reducer-level RED tests for undo, redo, selection restoration, saved-state dirty tracking, and redo invalidation before moving history ownership out of the legacy controller.
