# 0002 JSON Save Format

Status: Accepted

## Context

The user needs to save timeline data locally, load it later, and keep files portable.

## Decision

Use readable JSON as the primary save/load format.

Saved data should preserve timeline title, date range behavior, lines, events, periods, text items, item dates, and relevant editing state.

## Consequences

Positive:
- Human-readable.
- Easy to debug.
- Easy to migrate.
- Works without a backend.

Negative:
- Schema changes need care.
- Invalid imported JSON must be handled safely.
- Existing saved files should remain compatible unless a migration is intentional.
