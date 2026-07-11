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

## Recording Results

Record the checks run, browser used, and any failures in `docs/handoff.md`.
