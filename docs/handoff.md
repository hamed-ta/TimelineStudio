# Handoff

## Release 0.4.0 — 2026-10-25

- User approved the visual update and requested a minor-version release, push, and live GitHub Pages deployment.
- Bumped package and lockfile versions from `0.3.0` to `0.4.0`; moved all pending changelog entries into the dated `0.4.0` release section and updated versioning notes.
- The release includes the approved AuthKit-inspired appearance and changes accumulated since `0.3.0`, including selectable secondary calendars.
- Release verification passed: JavaScript syntax, 135/135 tests, production build/typecheck with `/TimelineStudio/` asset paths, matching package/lockfile versions, release-note extraction, and `git diff --check`.
- Published `v0.4.0` from release commit `46e4e07` and pushed `main` and the tag together. [Release/deployment workflow 40150712520](https://github.com/hamed-ta/TimelineStudio/actions/runs/40150712520) succeeded, including tests, typecheck, build, Pages deployment, and GitHub Release publication; branch CI also passed.
- [GitHub Release 0.4.0](https://github.com/hamed-ta/TimelineStudio/releases/tag/v0.4.0) includes `timeline-studio-0.4.0.zip` (608,087 bytes).
- Live verification passed at [the GitHub Pages site](https://hamed-ta.github.io/TimelineStudio/): rendered footer `Version 0.4.0`, midnight canvas `#05060f`, pill control radius `999px`, fonts loaded, and no browser console errors. The live app opened with empty data. Screenshot: ignored `.impeccable/review/live-0.4.0.jpg`.

## AuthKit Visual Direction — 2026-10-25

- The engineering-skill setup was committed and pushed to `origin/main` as `f91b6d9` before starting this work.
- User confirmed existing product facts remain in place, selected code-first for future showcase work, and requested code styling after `DESIGN.md` is written.
- Added Impeccable schema/platform metadata and a visual acceptance scenario without replacing existing product requirements.
- Recorded the supplied midnight/glass direction in `DESIGN.md` before implementation, as requested.
- RED browser check: the original dark editor computed `--bg: #141414`, `--accent: #1677ff`, and 7px Save-button corners; the requested midnight palette and pill/glass styling were absent.
- GREEN: updated `styles.css`, Ant Design theme tokens, font imports, and the sidebar heading. Fixed desktop command clipping and narrow metadata overlap; preserved all legacy IDs, controller/model code, and saved data behavior.
- Narrow dependencies: `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`, and `@fontsource-variable/vazirmatn`. Fonts are served locally; their license notices are included under `public/licenses/fonts/`.
- Verification: legacy JavaScript syntax passed, `npm test` passed 135/135, and production build/typecheck passed with the existing chunk-size advisory.
- Browser evidence: Codex in-app browser at 1440×1000 and 390×844 in dark/light, plus the user's 660×954 preview in dark. Final full-page captures are in ignored `.impeccable/review/`; document and inspector scroll positions were reset and checked before each final capture.
- Browser smoke passed for temporary bilingual period editing, Gregorian/Persian display, theme retention of visible title/ISO dates/color/calendar/unsaved state, undo/redo, sidebar collapse, accessible command wrapping, zoom-popover placement, and visible keyboard focus. No synthetic review data was added to app defaults or repository timeline files.
- The mechanical detector ran once. The thick warning edge was removed; reference-pinned heading gradient and blueprint grid were retained. Remaining palette/geometry advisories were supplied to the reviewer for context.
- Independent Impeccable finish review returned `ship` after all six required final captures were reopened. The documenter reconciled `DESIGN.md` with implemented tokens and produced `.impeccable/design.json` with nine representative components, depth/motion/breakpoints, and matching narrative.
- Documentation/configuration checks and `git diff --check` passed. The production build includes all three font license notices. The preview was restored to an empty timeline with System appearance and an expanded inspector after undoing the four temporary review edits.
- Rendered reduced-motion/forced-colors emulation and physical-device checks remain explicitly deferred. Their source rules are present; these are not recorded as rendered passes.
- The visual work is included in the `0.4.0` release preparation above. Next implementation task remains reducer-owned undo/redo history.

## Engineering Skill Setup — 2026-10-25

- Added `AGENTS.md` consumer pointers and `docs/agents/` configuration for GitHub Issues in `hamed-ta/TimelineStudio`, the five default triage labels, and a single-context domain-doc layout.
- Domain terms will be maintained in root `CONTEXT.md` when resolved by `domain-modeling`; existing architectural decisions remain in `docs/adr/`.
- Updated the plan and changelog for this documentation-only setup.
- Verification: `git diff --check` and a focused documentation audit passed. The audit checked the single Agent skills block, preserved existing instructions, three resolving configuration pointers, tracker/origin agreement, exact label mappings, single-context rules, and file whitespace. The calendar application checks below are retained evidence from the earlier implementation session and were not rerun for this setup.

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
