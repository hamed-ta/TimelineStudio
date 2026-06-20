# Plan

## Current Goal

Move Timeline Studio toward a modern account-based web app while preserving the current local timeline editor behavior.

## Current Slice

Normalize the app typography with a Persian-capable modern font stack and consistent type scale.

## Now

- Keep the birthdate label to the left of the vertical line when possible.
- Show hovered date, Iranian date, and age in a fixed info panel below the timeline instead of a cursor-following tooltip.
- Show selected item dates, duration, line, and age context in the same info panel.
- Split selected item details into short readable lines instead of one dense metadata sentence.
- Size the timeline viewport to the rendered axis, lines, and note area instead of stretching into unused workspace height.
- Stack, simplify, or skip month and day labels so axis date text does not overlap at crowded zoom levels.
- Keep Fit from zooming out below a readable minimum on long timelines.
- Snap lane-bound items to nearby same-line item edges and prevent same-line range overlap while dragging.
- Expand the preset color palette beyond the first 10 colors.
- Add recognizable icons to timeline action buttons.
- Use colored icon treatments for toolbar and context menu actions without adding another icon dependency.
- Group create, file, and export toolbar actions.
- Move item locking into a dedicated icon toggle instead of a checkbox inside the action row.
- Keep manual zoom-out from going below the readable minimum.
- Add zoom actions to the timeline context menu.
- Show a centered empty state when the timeline has no items.
- Use a Persian-capable modern sans-serif stack without adding a font dependency.
- Normalize UI font sizes onto a small rem-based type scale.
- Apply the same font stack to SVG timeline labels.
- Preserve birth line rendering, save/load behavior, and age calculations.
- Preserve normal event, period, line, text, save/load, pan, zoom, and export behavior.
- Keep personal timeline JSON files in ignored `user-data/`.

## Next

- Start small UI polish slices in React while preserving the element IDs and behavior expected by `app.js`.
- Verify local JSON load, edit, save, pan, zoom, fit, and export before adding Firebase.
- Add Firebase only after the local app migration is stable.

## Later

- Add Firebase Auth with Google and email/password sign-in.
- Add Firestore-backed per-user timeline storage behind a repository abstraction.
- Add Firebase Hosting deployment.
- Add optional Google Drive import/export as a user-owned backup path.
- Add a lightweight automated browser test harness when the user wants true test-first red/green UI checks.
- Add validation for malformed imported JSON.
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
- Committed the agentic workflow docs in `e3ef60b`.
- Added `.gitignore` rules for `user-data/` and `.DS_Store`.
- Committed ignored user data and handoff cleanup in `ca4bd12`.
- Committed the modern web app migration plan in `4f95f80`.
- Committed the minimal Vite, React, and TypeScript shell in `62f912a`.
- Extracted timeline document types, default timeline creation, item normalization, and timeline normalization into `src/timeline/model.ts`.
- Extracted shared date parsing, date math, snapping, clamping, and numeric normalization helpers into `src/timeline/dates.ts`.
- Extracted timeline JSON parse and serialize behavior into `src/timeline/json.ts`.
- Extracted browser download and save-picker helpers into `src/platform/files.ts`.
- Extracted PDF byte generation into `src/timeline/pdf.ts`.
- Extracted image loading and canvas-to-blob helpers into `src/platform/media.ts`.
- Extracted SVG export serialization and export CSS into `src/timeline/svgExport.ts`.
- Extracted display date, Iranian date, month, and zoom formatting into `src/timeline/formatters.ts`.
- Added `CHANGELOG.md` and `docs/versioning.md` without bumping the package version.
- Added system light/dark theme tokens, component styling, and a theme switcher.
- Added dependency policy guidance in ADR 0006 and agent docs.
- Added collapsible sidebar and toolbar controls with `lucide-react` icons.
- Moved the timeline title, date range, and Fit action into the main top bar.
- Added drag reordering and removal for timeline lines.
- Added vertical all-line marker items.
- Added annotation note items with leader arrows and balloons.
- Updated event markers with a beveled, glass-like visual treatment.
- Added softer period bar backgrounds.
- Added current-file JSON save behavior where browser file handles are available.
- Added visible unsaved-change state and `Ctrl+S` / `Command+S` JSON saving.
- Added saved birthdate items with prominent all-line rendering.
- Added live age hover readouts and derived period age/duration labels.
- Added same-line item edge snapping and readable fit/axis behavior.
- Added a curated item color palette and random palette colors for new items.
- Added a context menu and shortcuts for timeline item commands.

## Risks

- Browser file picker support varies.
- Export behavior may differ across browsers.
- Manual testing is still doing work that automated browser tests should eventually cover.
- Workflow docs can drift if `/closeup` is not used consistently.
- Personal JSON files should stay in ignored `user-data/`.
- The framework migration can accidentally change timeline behavior if it is done as a rewrite instead of small preservation steps.
- UI changes must preserve the DOM IDs and data attributes that legacy `app.js` still binds to until the controller is migrated.
- Version changes should be intentional and documented in `CHANGELOG.md`; do not bump `package.json` during routine migration slices.
- Firebase read/write patterns can create avoidable cost if autosave and realtime listeners are not scoped carefully.
- Dependencies can increase bundle size, audit noise, and maintenance cost if they are not scoped to real feature value.
- `lucide-react` is justified only for focused iconography; avoid expanding it into a full design-system dependency.

## Verification Checklist

During the current legacy-app phase:

- `node --check app.js`
- `npm run typecheck`
- `npm run build`
- App loads at `http://127.0.0.1:8765/`
- Create event
- Create period
- Rename line
- Pan by dragging
- Zoom in/out
- Fit timeline
- Save JSON
- Load JSON
- Export SVG/PNG/PDF

- Existing local JSON can be loaded, edited, and saved
