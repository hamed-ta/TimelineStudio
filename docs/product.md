# Timeline Studio Product Notes

## Purpose

Timeline Studio lets a user create a personal horizontal timeline with events, periods, text notes, and named lines. The timeline can be panned, zoomed, saved, loaded, and exported.

## Core Concepts

### Timeline

A horizontal date-based canvas. Time flows left to right.

### Line

A named horizontal lane used to group related items, such as School, Home, Work, Family, or Notes.

### Event

A point-in-time item with a title, date, optional description, and assigned line.

### Period

A date range with a start date and end date.

### Text Item

A freeform note attached to the timeline.

### Lock State

When items are locked, dragging the canvas should pan the timeline and should not accidentally move items.

## Date Behavior

- Gregorian ISO dates are the internal source of truth.
- Timeline labels may show Iranian dates in English letters and numbers.
- Saved data should preserve exact dates.
- The timeline should support year, month, and day precision.
- The app should not show `AD` after Gregorian date labels.

## Data Behavior

- The app starts with empty data.
- Personal timeline data should be created by the user or loaded from a file.
- The project should not include personal sample data as default app state.
- JSON is the primary save/load format.

## Acceptance Scenarios

### Start Empty

Given the user opens the app for the first time
When no timeline file has been loaded
Then the timeline starts empty
And no personal sample data is displayed.

### Create An Event

Given an empty timeline
When the user creates an event on `2001-03-04`
Then the event appears at the correct date position
And it is still present after save/load.

### Create A Period

Given a timeline with a School line
When the user creates a period from `1998-09-01` to `2001-06-30`
Then the period spans that range horizontally.

### Rename A Line

Given a timeline line exists
When the user renames the line
Then the new name is shown on the timeline
And the name is preserved after save/load.

### Lock Items

Given timeline items are locked
When the user click-drags the timeline
Then the canvas pans
And no item changes date or line.

### Zoom To Days

Given the user zooms into a timeline
When the zoom level is high enough for day-level detail
Then day ticks or day labels are visible.

### Fit Timeline

Given the timeline contains items across a date range
When the user clicks Fit
Then the visible viewport adjusts to show the full timeline range.

### Save And Load Timeline

Given the user has created timeline data
When the user saves the timeline as JSON
And later loads the JSON file
Then the title, date range, lines, events, periods, and text items are restored.

### Export

Given the user has a visible timeline
When the user exports PNG, SVG, or PDF
Then the exported file contains the current timeline view.
