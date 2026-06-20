# Browser Smoke Checklist

Use this checklist for UI behavior changes until automated browser tests exist.

## Setup

1. Start the local server:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

2. Open:

```text
http://127.0.0.1:8765/index.html
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

## Recording Results

Record the checks run, browser used, and any failures in `docs/handoff.md`.
