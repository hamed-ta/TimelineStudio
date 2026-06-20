# Timeline Studio

A local-first web app for building horizontal personal timelines.

## Run

Install dependencies and start the Vite dev server:

```sh
npm install
npm run dev -- --port 8765
```

Open:

```text
http://127.0.0.1:8765/
```

Build:

```sh
npm run build
```

## What it supports

- Horizontal scrollable SVG timeline
- Zoom controls and pointer-centered zoom with Ctrl/Command + mouse wheel
- Day ticks and labels at higher zoom levels
- Real date placement with year, month, week, or day drag snapping
- Event, period, line, and text items
- Global item lock to prevent accidental moves while panning
- Click-and-drag panning across the timeline canvas
- Renamable row/line labels
- Dragging items across dates and lanes
- Resize handles for periods and lines
- Dynamic Gregorian and transliterated Iranian Solar Hijri date labels
- JSON save/load with a browser save dialog when supported
- SVG, PNG, and single-page PDF export

The app starts with a blank timeline ending at today by default. Use `Load JSON` to open saved timelines.
