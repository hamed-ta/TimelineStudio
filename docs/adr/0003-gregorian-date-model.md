# 0003 Gregorian Date Model

Status: Accepted

## Context

Timeline Studio displays Gregorian dates and Iranian calendar labels. The app needs reliable date math for positioning, zooming, dragging, save/load, and export.

## Decision

Store and calculate dates internally as Gregorian ISO dates in `YYYY-MM-DD` form.

Iranian date labels are derived display output, using English letters and numbers.

## Consequences

Positive:
- Date math stays predictable.
- Saved files remain straightforward.
- Iranian labels can be improved without changing stored data.

Negative:
- Iranian date input would need explicit conversion logic if added later.
- Display bugs in conversion code can appear even when stored data is correct.
