# Plan

## Current Goal

Continue the ADR 0009 migration by moving undo/redo history ownership into the reducer-managed editor state.

## Completed

- Released `0.4.0` with the approved visual update and accumulated changelog entries. GitHub Actions and Pages deployment passed, and the live website's version/theme were verified; evidence is in `docs/handoff.md`.
- Applied the supplied AuthKit direction to the editor after writing `DESIGN.md`: midnight/daylight themes, frosted surfaces, pill controls, responsive metadata/toolbars, and visible focus.
- Added narrow presentation dependencies `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`, and `@fontsource-variable/vazirmatn` for locally served type with Persian coverage; bundled their font license notices.
- Configured the engineering skills for GitHub Issues, the five default triage labels, and a single-context domain-doc layout in `docs/agents/`, with consumer pointers in `AGENTS.md`.
- Added Gregorian-only, dual-calendar, and secondary-only display using one optional secondary calendar: Persian / Solar Hijri, Islamic / Umm al-Qura, Hebrew, Buddhist, Japanese, or Indian / Saka.
- Preserved Gregorian ISO storage and calculations, existing Persian JSON compatibility, and non-mutating fallback for recognized calendars unsupported by the browser.

## Next

- Resume ADR 0009 undo/redo migration with RED reducer tests for undo, redo, selection restoration, saved-state dirty tracking, and redo invalidation after a new edit.

## Risks

- Avoid running reducer and legacy histories as competing sources of truth during the migration.

## Latest Verification

- Visual work passed syntax, 135 tests, production build/typecheck, and in-app browser verification; the finish reviewer returned `ship`. Evidence and remaining manual coverage are recorded in `docs/handoff.md`.
- Engineering-skill configuration passed the documentation audit and `git diff --check`; details are recorded in `docs/handoff.md`.
- Final calendar-feature verification is recorded in `docs/handoff.md`.
