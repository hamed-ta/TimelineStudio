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

- Confirm a new timeline starts with Gregorian enabled and Secondary calendar set to None.
- Confirm Gregorian cannot be disabled while Secondary calendar is None.
- Select each supported secondary option and confirm English labels with Latin digits render without console errors.
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

## Recording Results

Record the checks run, browser used, and any failures in `docs/handoff.md`.

## Latest Result

- 2026-10-25: Sage + amber branding passed in the Codex in-app browser using the production `/TimelineStudio/` build, desktop/mobile/660px in light/dark, with theme/item-state and undo/redo smoke. Forced colours were source-reviewed; real home-screen installation and external crawler previews were not exercised. Details and capture paths are in `docs/handoff.md`.
- 2026-08-02: The selectable secondary-calendar feature was user-confirmed working in the browser. The browser family was not recorded.
