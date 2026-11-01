# Browser Smoke Checklist

Use this checklist for UI behavior changes until automated browser tests exist.

## Setup

1. Start the local server:

```sh
npm run dev -- --port 8765
```

2. Open:

```text
http://127.0.0.1:8765/
```

## Core Checks

- App loads without visible errors.
- Timeline starts empty unless a file is loaded.
- Create a line and rename it.
- Create an event and confirm it appears on the correct date.
- Create a period and confirm it spans the correct date range.
- Pan the timeline by click-dragging the canvas.
- Toggle item lock and confirm dragging pans without moving items.
- Zoom in until day ticks are visible.
- Zoom out and use Fit to show the full timeline.
- Save JSON and load it back.
- Export SVG, PNG, and PDF.
- Drag a note balloon above the central axis and confirm the full balloon remains visible in the canvas below the separate cursor-readout row.
- Move the cursor across dates with short and long labels and confirm the relative date, age, and date stay anchored in stable columns.
- With a short or empty timeline, confirm the rendered timeline sits centered vertically with similar spare space above and below.
- Confirm a new timeline has `Line 1` through `Line 6` from top to bottom, with three lines on each side of the axis.
- Drag a line across the axis and confirm its name stays unchanged.
- Confirm the add-line control is fully visible and alternating time bands continue to the top and bottom edges of the visible canvas.
- Grow and shrink the timeline area with the bottom resize handle and confirm the axis stays centered, top and bottom space change equally, and alternating time bands resize immediately without zooming.
- Move a note or marker callout beyond only one side of the normal line area and confirm the additional item-driven canvas space remains on that side.

## Display Calendar Checks

- In English, Spanish and French, confirm a new timeline starts with Gregorian enabled and Secondary calendar set to None. In Persian, confirm Gregorian is off and Persian / Solar Hijri is selected; in Arabic, confirm Gregorian is off and Islamic / Umm al-Qura is selected.
- Confirm Gregorian cannot be disabled while Secondary calendar is None.
- Select each supported secondary option and confirm labels follow the chosen interface language and numbering system without console errors.
- Confirm Gregorian plus a secondary calendar shows dual date text while Gregorian continues to own timeline boundaries.
- Disable Gregorian and confirm the selected secondary calendar owns year/month boundaries, day values, grid lines, ticks, and alternating bands.
- Switch secondary calendars while Gregorian is disabled and confirm secondary-only mode is preserved.
- Return Secondary calendar to None and confirm Gregorian is automatically enabled and disabled from editing.
- Confirm header dates, cursor readout, selected-item details, item previews, and SVG/PNG/PDF exports follow the selected display calendars.
- Save and reload Gregorian-only, dual-calendar, and secondary-only JSON and confirm the display selection is restored.
- Load an existing Persian `displayCalendars` selection and confirm it remains compatible.
- Undo a calendar display change back to the saved state and confirm `Unsaved changes` clears; redo it and confirm the display change returns.

## Brand Identity Checks

- Confirm the header and footer show Gentle turn in sage/amber in Light, Dark, and System, with the correct theme-specific shades.
- Check desktop, 390 px mobile, and the 660 px preview width: the logo/name do not overlap metadata or introduce page overflow.
- Confirm the favicon, manifest, Apple/home-screen icons, and social-preview image resolve in the production build under `/TimelineStudio/`.
- Confirm the brand remains visible in forced colours; source-review this explicitly if the browser cannot emulate the mode.
- Switch appearance with an unsaved timeline and confirm item values, dirty state, and undo/redo remain intact.

Branding RED baseline, 2026-10-25: the in-app browser at 660×988 showed the CSS gradient-square `SPAN` in the header, no footer symbol, and no `link[rel~=icon]` metadata. The approved symbol and icon coverage were absent. There is no automated browser harness; use the checklist above as the manual RED/GREEN seam.

## Language Checks

- Switch through English, Español, Français, فارسی and العربية; confirm labels, accessible names, theme names, statuses, confirmations and date/age/duration text update.
- Reload after choosing a language; confirm it is remembered and a new empty timeline has that language’s calendar and default names.
- Change language with existing calendars, selected items, typed-but-unapplied form/hex/note drafts and undo history; confirm those values survive, dates/x coordinates stay fixed and the document does not gain an edit.
- Check the language control’s vertical center against the theme/zoom/height controls. In RTL, verify sidebar collapse/expand arrows point toward/away from the correct edge and custom select chevrons appear left of text.
- Inspect desktop, 390 px mobile and 660 px light/dark; check no page overflow, readable mixed-script fields, keyboard focus and usable popovers/context menus.
- Export mixed Persian/Arabic/Latin text as SVG, PNG and PDF. Open SVG independently and inspect the raster/PDF; fonts should be embedded and add-line controls, cursor guides and selection grips absent.
- Run `npm run i18n:check`, syntax, tests, typecheck and a build using `/TimelineStudio/` paths.

Localization RED: initial English-only interface had no language selector. Automated locale tests initially failed on the missing locale module; grapheme fitting split a family emoji; the language-calendar-default test initially returned Gregorian for Persian. User screenshots additionally showed the inherited 11 px label margin lifting the selector and an unmirrored RTL sidebar toggle. These are the corresponding automated/manual RED checks for this feature.

## Recording Results

Record the checks run, browser used, and any failures in `docs/handoff.md`.

## Latest Result

- 2026-11-01: Five-language production `/TimelineStudio/` preview passed all-five locale/default-calendar switches, draft/selection/geometry and calendar undo/redo checks, desktop/mobile/660px light/dark inspection and SVG/PNG/PDF font/control checks. Independent finish review returned `ship` after user feedback fixes. Native picker roundtrip, fluent-speaker translation review and physical-device/accessibility-media coverage remain unverified; see handoff.
- 2026-10-25: Sage + amber branding passed in the Codex in-app browser using the production `/TimelineStudio/` build, desktop/mobile/660px in light/dark, with theme/item-state and undo/redo smoke. Forced colours were source-reviewed; real home-screen installation and external crawler previews were not exercised. Details and capture paths are in `docs/handoff.md`.
- 2026-08-02: The selectable secondary-calendar feature was user-confirmed working in the browser. The browser family was not recorded.
