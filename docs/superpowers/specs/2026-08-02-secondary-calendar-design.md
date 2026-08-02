# Selectable Secondary Calendars Design

## Summary

Timeline Studio will keep Gregorian ISO dates as the only stored and calculated date source while allowing one optional secondary display calendar. Users can display Gregorian only, Gregorian plus one secondary calendar, or the secondary calendar only. All calendar wording and numbers remain English/Latin-script until localization is introduced.

## Supported Calendars

Gregorian remains the fixed main calendar. The first secondary-calendar release supports:

| Stored ID | UI Label | `Intl` Calendar |
| --- | --- | --- |
| `iranian` | Persian / Solar Hijri | `persian` |
| `islamic-umalqura` | Islamic / Umm al-Qura | `islamic-umalqura` |
| `hebrew` | Hebrew | `hebrew` |
| `buddhist` | Buddhist | `buddhist` |
| `japanese` | Japanese | `japanese` |
| `indian` | Indian / Saka | `indian` |

The existing `iranian` stored ID is retained for saved-JSON compatibility.

## User Interface

Replace the two calendar checkboxes with a compact calendar section containing:

- A `Gregorian` checkbox for the main display calendar.
- A `Secondary calendar` select with `None` plus the six supported options.

New timelines start with Gregorian checked and Secondary set to None.

Selecting a secondary calendar preserves the current Gregorian checkbox state. Because Gregorian starts enabled, the normal first selection shows both calendars. The user may then uncheck Gregorian to show only the secondary calendar.

When Secondary is set to None, Gregorian is automatically checked and its checkbox is disabled. This makes the invalid no-calendar state impossible in the UI.

Changing from one secondary calendar to another keeps the Gregorian checkbox state. For example, Persian-only changed to Hebrew becomes Hebrew-only.

## Saved Data And Compatibility

Keep the existing `settings.displayCalendars` array instead of introducing new persisted fields.

Canonical examples:

- Gregorian only: `["gregorian"]`
- Gregorian and Hebrew: `["gregorian", "hebrew"]`
- Hebrew only: `["hebrew"]`

The array may contain Gregorian and at most one secondary calendar. Normalization removes duplicates and unknown calendar IDs. If multiple recognized secondary values are supplied, normalization keeps the first one from the input. If no valid calendar remains, normalization returns `["gregorian"]`. A recognized calendar that lacks runtime browser support remains stored and is handled by the non-mutating display fallback below.

Existing saved values continue to work:

- `["gregorian", "iranian"]` remains dual Gregorian/Persian display.
- `["iranian"]` remains Persian-only display.
- Missing, empty, or invalid calendar settings now fall back to Gregorian only.

No timeline document version change is required because the field shape remains an array of string calendar IDs and existing values remain valid.

## Calendar Registry

Create a central calendar registry in the timeline domain. Each definition owns:

- Stored ID and English UI label.
- Unicode `Intl` calendar identifier.
- Full-date formatter.
- Year, month, day, era, and month-label extraction.
- A stable month key and year key for boundary detection.
- Runtime support detection.

Formatting uses `Intl.DateTimeFormat` with an English locale, UTC timezone, and Latin digits. Persian continues to display transliterated month names such as `Mordad`; other calendars use their standard English names and era labels.

The existing Persian-specific public helpers may temporarily delegate to the registry so current callers and tests can migrate in small slices.

## Timeline Rendering

### Gregorian Visible

Gregorian remains the axis calendar. Year/month boundaries, ticks, grid lines, and alternating bands follow Gregorian dates. When a secondary calendar is selected, its English month/date labels are stacked with Gregorian labels in the same manner as the current dual Gregorian/Persian display.

### Secondary Only

The selected secondary calendar owns:

- Year boundaries and labels.
- Month boundaries and labels.
- Day values.
- Grid lines and ticks.
- Alternating month bands.

Boundary generation scans deterministic Gregorian ISO days and compares registry-provided calendar month/year keys. This supports variable-length lunar months, Hebrew leap months, Japanese eras, and calendars whose year does not begin on January 1. Results are cached by calendar ID and Gregorian date range.

Axis density rules remain zoom-driven. The selected calendar changes boundary dates and labels, not the existing collision thresholds or date-to-X calculations.

## Other Display Surfaces

The effective display selection applies consistently to:

- Header timeline range.
- Central-axis labels.
- Cursor readout.
- Selected-item information.
- Item calendar preview.
- Period start/end details.
- SVG, PNG, and PDF exports.

All age, duration, snapping, dragging, sorting, and date-range calculations continue using Gregorian ISO dates.

## Runtime Support And Errors

Each registry entry checks whether the browser resolves the requested `Intl` calendar correctly.

- Unsupported secondary options are disabled in the selector.
- If a saved file requests a calendar unsupported by the current browser, keep the stored selection unchanged, show a clear status warning, and temporarily render Gregorian as the effective display calendar.
- The fallback must not silently rewrite the loaded timeline or mark it dirty.

The target browsers are modern browsers with full `Intl` calendar data, so this path is defensive rather than expected during normal use.

## Testing

### Unit Tests

- Calendar type guards and normalization, including the one-secondary invariant.
- New-timeline Gregorian-only default.
- Backward compatibility for existing Persian selections.
- Representative full-date formatting for every calendar.
- Stable English/Latin-script output and era handling.
- Month/year boundary generation for each calendar.
- Variable Islamic month lengths and a Hebrew leap-month range.
- Gregorian-only, dual-calendar, and secondary-only output ordering.
- Unsupported-runtime effective-display fallback without mutating saved settings.

### Browser Smoke

- Secondary dropdown options and Gregorian checkbox enable/disable rules.
- Switching Gregorian-only to dual display and secondary-only display.
- Changing between secondary calendars while Gregorian is disabled.
- Axis ticks, labels, and bands in Gregorian-visible and secondary-only modes.
- Header, cursor, selection panel, previews, save/load, and exports.
- Existing Persian JSON restoration.
- No console errors during calendar or zoom changes.

## Documentation

Update `docs/product.md`, `docs/plan.md`, `docs/handoff.md`, `docs/workflows/browser-smoke.md`, and `CHANGELOG.md` during implementation. Add an ADR only if implementation reveals a new lasting dependency or changes the accepted Gregorian-storage boundary.

## Out Of Scope

- Localized application UI.
- Native-script month names or non-Latin digits.
- User-defined calendars.
- More than one secondary calendar at a time.
- Non-Gregorian date entry or storage.
- Changes to age, duration, snapping, drag, or sorting calculations.
