# Selectable Secondary Calendars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users display Gregorian only, Gregorian plus one supported secondary calendar, or one secondary calendar only, while preserving Gregorian ISO storage and calculations.

**Architecture:** Keep `settings.displayCalendars` as the persistence boundary, add a typed calendar-selection domain and an `Intl.DateTimeFormat` registry, and move non-Gregorian axis boundary discovery into a pure cached scanner. React renders the controls, while the legacy editor reads those controls and renders from an effective display selection that can fall back to Gregorian without mutating unsupported saved settings.

**Tech Stack:** Vite, React, TypeScript, native browser `Intl.DateTimeFormat`, Node test runner, SVG timeline renderer.

## Global Constraints

- Gregorian ISO `YYYY-MM-DD` remains the only stored and editable date representation.
- Age, duration, sorting, snapping, dragging, and date-to-X calculations remain Gregorian.
- Persist at most one recognized secondary calendar while retaining the existing `iranian` ID.
- Use English calendar names, English month names, Latin digits, and UTC formatting.
- Do not add a runtime dependency or document-version migration.
- Follow `docs/workflows/red-green-refactor.md`: acceptance scenario, RED test, smallest GREEN change, refactor, verification.
- Preserve unsupported recognized selections in saved state; only the effective render selection falls back to Gregorian.
- Do not commit unrelated worktree changes.

---

## File And Interface Map

### New Files

- `src/timeline/calendarRegistry.ts`: calendar metadata, `Intl` formatter construction, support detection, date parts, labels, and effective fallback.
- `src/timeline/calendarRegistry.test.js`: representative formatting, support, Latin-digit, and fallback tests.
- `src/timeline/calendarBoundaries.ts`: cached month/year transition discovery over Gregorian ISO days.
- `src/timeline/calendarBoundaries.test.js`: transition invariants and representative calendar edge cases.

### Modified Files

- `src/timeline/calendars.ts`: display-calendar types, supported secondary IDs, normalization, and control-state helpers.
- `src/timeline/calendars.test.js`: one-secondary invariant and UI-state tests.
- `src/timeline/model.ts` and `src/timeline/model.test.js`: Gregorian-only default and compatibility tests.
- `src/timeline/formatters.ts` and `src/timeline/formatters.test.js`: registry-backed generic display formatting; temporary Persian helper compatibility.
- `src/features/timeline-editor/components/EditorSidebar.tsx`: Gregorian checkbox, secondary selector, and support warning.
- `src/features/timeline-editor/legacyTimelineEditor.js`: control bridge, effective selection, generic secondary labels, and generic secondary-only axis.
- `src/features/timeline-editor/timelineInfo.ts` and `src/features/timeline-editor/timelineInfo.test.js`: generic calendar placeholders and output ordering.
- `styles.css`: compact secondary-calendar control and warning styles.
- `docs/product.md`, `docs/workflows/browser-smoke.md`, `docs/plan.md`, `docs/handoff.md`, `CHANGELOG.md`, and `README.md`: behavior, verification, and user-facing capability updates.

### Core Interfaces

```ts
export type TimelineSecondaryCalendar =
  | "iranian"
  | "islamic-umalqura"
  | "hebrew"
  | "buddhist"
  | "japanese"
  | "indian";

export type TimelineDisplayCalendar = "gregorian" | TimelineSecondaryCalendar;

export type CalendarDateParts = {
  year: string;
  month: string;
  day: string;
  era: string;
  monthLabel: string;
  yearKey: string;
  monthKey: string;
};

export type CalendarControlState = {
  showGregorian: boolean;
  secondary: TimelineSecondaryCalendar | null;
  gregorianDisabled: boolean;
};
```

---

## Task 1: Record Acceptance Behavior And Calendar Selection Rules

**Files:**
- Modify: `docs/product.md`
- Modify: `src/timeline/calendars.ts`
- Test: `src/timeline/calendars.test.js`
- Modify: `src/timeline/model.ts`
- Test: `src/timeline/model.test.js`

- [x] **Step 1: Add the BDD scenarios before runtime changes**

Add scenarios covering:

```gherkin
Scenario: A new timeline starts with Gregorian only
  Given the user creates a new timeline
  Then Gregorian is displayed
  And the secondary calendar is None

Scenario: Display one optional secondary calendar
  Given Gregorian is displayed
  When the user selects Hebrew as the secondary calendar
  Then Gregorian and Hebrew dates are displayed
  When the user turns Gregorian off
  Then Hebrew owns the timeline axis labels and boundaries

Scenario: Prevent an empty calendar display
  Given no secondary calendar is selected
  Then Gregorian is selected and cannot be turned off

Scenario: Restore an unsupported secondary calendar safely
  Given a saved timeline selects a recognized calendar unsupported by the browser
  When the timeline is loaded
  Then the saved selection remains unchanged
  And the timeline temporarily renders Gregorian
  And the app does not mark the timeline as changed
```

- [x] **Step 2: Write failing normalization and control-state tests**

Extend `src/timeline/calendars.test.js` with exact cases:

```js
assert.deepEqual(
  normalizeDisplayCalendars(["hebrew", "gregorian", "iranian"]),
  ["gregorian", "hebrew"],
);
assert.deepEqual(normalizeDisplayCalendars(["iranian"]), ["iranian"]);
assert.deepEqual(normalizeDisplayCalendars(["unknown"]), ["gregorian"]);
assert.deepEqual(normalizeDisplayCalendars([]), ["gregorian"]);

assert.deepEqual(calendarControlState(["gregorian"]), {
  showGregorian: true,
  secondary: null,
  gregorianDisabled: true,
});
assert.deepEqual(calendarControlState(["hebrew"]), {
  showGregorian: false,
  secondary: "hebrew",
  gregorianDisabled: false,
});
assert.deepEqual(displayCalendarsFromControls(false, null), ["gregorian"]);
assert.deepEqual(displayCalendarsFromControls(false, "hebrew"), ["hebrew"]);
```

Update `src/timeline/model.test.js` to expect `createEmptyTimeline().settings.displayCalendars` and invalid/missing normalization to equal `["gregorian"]`, while retaining explicit Persian-only and Gregorian/Persian compatibility assertions.

- [x] **Step 3: Run focused tests to verify RED**

Run:

```sh
node --experimental-strip-types --test src/timeline/calendars.test.js src/timeline/model.test.js
```

Expected: FAIL because secondary IDs and control helpers do not exist, and the old default is both calendars.

- [x] **Step 4: Implement the typed selection domain**

In `src/timeline/calendars.ts`, add `SECONDARY_CALENDAR_IDS`, `isSecondaryCalendar`, and these rules:

```ts
export function normalizeDisplayCalendars(value: unknown): TimelineDisplayCalendar[] {
  const values = Array.isArray(value) ? value : [value];
  const showGregorian = values.includes("gregorian");
  const secondary = values.find(isSecondaryCalendar) ?? null;
  if (!secondary) return ["gregorian"];
  return showGregorian ? ["gregorian", secondary] : [secondary];
}
```

Add pure `calendarControlState()` and `displayCalendarsFromControls()` helpers. Change `DEFAULT_DISPLAY_CALENDARS` and `createEmptyTimeline()` to Gregorian only. Do not filter recognized IDs based on current runtime support.

- [x] **Step 5: Run focused tests to verify GREEN**

Run the focused command again.

Expected: all calendar selection and model tests PASS.

- [x] **Step 6: Commit the selection slice**

```sh
git add docs/product.md src/timeline/calendars.ts src/timeline/calendars.test.js src/timeline/model.ts src/timeline/model.test.js
git commit -m "feat: define secondary calendar selection rules"
```

---

## Task 2: Build The Generic Calendar Registry

**Files:**
- Create: `src/timeline/calendarRegistry.ts`
- Create: `src/timeline/calendarRegistry.test.js`
- Modify: `src/timeline/formatters.ts`
- Modify: `src/timeline/formatters.test.js`

- [x] **Step 1: Write failing registry and formatting tests**

Test all six definitions and representative output for `1990-08-20`:

```js
assert.equal(formatCalendarDate("1990-08-20", "iranian"), "29 Mordad 1369");
assert.equal(formatCalendarDate("1990-08-20", "islamic-umalqura"), "29 Muharram 1411 AH");
assert.equal(formatCalendarDate("1990-08-20", "hebrew"), "29 Av 5750 AM");
assert.equal(formatCalendarDate("1990-08-20", "buddhist"), "20 August 2533 BE");
assert.equal(formatCalendarDate("1990-08-20", "japanese"), "20 August 2 Heisei");
assert.equal(formatCalendarDate("1990-08-20", "indian"), "29 Sravana 1912 Saka");
```

Use an ASCII normalization for the Indian era label because some engines return `Śaka`; the app contract is English/Latin wording without mixed scripts, not a specific accented glyph.

Also test:

```js
assert.deepEqual(effectiveDisplayCalendars(["gregorian", "hebrew"], () => true), ["gregorian", "hebrew"]);
assert.deepEqual(effectiveDisplayCalendars(["hebrew"], () => false), ["gregorian"]);
assert.deepEqual(effectiveDisplayCalendars(["gregorian", "hebrew"], () => false), ["gregorian"]);
assert.equal(formatDateForCalendars("1990-08-20", ["gregorian", "hebrew"]), "Aug 20, 1990 / 29 Av 5750 AM");
```

Assert every result contains only ASCII digits with `/[0-9]/` and no Arabic-Indic or Persian digits with `/[\u0660-\u0669\u06f0-\u06f9]/`.

- [x] **Step 2: Run focused tests to verify RED**

```sh
node --experimental-strip-types --test src/timeline/calendarRegistry.test.js src/timeline/formatters.test.js
```

Expected: FAIL because the registry and generic formatters do not exist.

- [x] **Step 3: Implement registry metadata and formatter factories**

Define immutable entries containing stored ID, label, `Intl` calendar ID, and whether the era is required in full dates. Build formatters with:

```ts
const locale = `en-US-u-ca-${definition.intlCalendar}-nu-latn`;
const options = { timeZone: "UTC" } as const;
```

Use `formatToParts()` instead of parsing formatted strings. Construct full dates in stable `day month year era` order; omit `AP` for Persian to preserve existing output. Normalize `Śaka` to `Saka`. Include era in `yearKey` and `monthKey`, and include the month text in `monthKey` so Hebrew leap months remain distinct.

Runtime support detection must verify:

```ts
formatter.resolvedOptions().calendar === definition.intlCalendar
```

Catch formatter construction errors and return `false`.

- [x] **Step 4: Delegate existing formatting APIs to the registry**

Change `formatDateForCalendars()` to map Gregorian through `formatDisplayDate()` and every secondary through `formatCalendarDate()`. Keep `formatIranianDate()`, `iranianYear()`, `iranianDay()`, `iranianDateParts()`, and `iranianMonthName()` as compatibility wrappers for this slice; remove them only after all renderer callers migrate.

- [x] **Step 5: Run tests and typecheck**

```sh
node --experimental-strip-types --test src/timeline/calendarRegistry.test.js src/timeline/formatters.test.js
npm run typecheck
```

Expected: tests PASS and TypeScript reports no errors.

- [x] **Step 6: Commit the registry slice**

```sh
git add src/timeline/calendarRegistry.ts src/timeline/calendarRegistry.test.js src/timeline/formatters.ts src/timeline/formatters.test.js
git commit -m "feat: add generic calendar formatting registry"
```

---

## Task 3: Discover Secondary Calendar Boundaries Deterministically

**Files:**
- Create: `src/timeline/calendarBoundaries.ts`
- Create: `src/timeline/calendarBoundaries.test.js`

- [x] **Step 1: Write failing boundary tests**

Test `calendarBoundaryDates(calendar, startDate, endDate, unit)` for every secondary ID. For each returned month boundary, assert its `monthKey` differs from the previous Gregorian day; for each returned year boundary, assert its `yearKey` differs from the previous day.

Add exact edge cases:

```js
assert.ok(calendarBoundaryDates("iranian", "2026-03-15", "2026-03-28", "year").includes("2026-03-21"));
```

For Umm al-Qura, scan a range containing at least three returned month boundaries and assert adjacent Gregorian month lengths include a non-30-day month. For Hebrew, scan `2023-08-01` through `2024-05-31` and assert month labels include both `Adar I` and `Adar II`.

Test that repeated calls return equal values but callers cannot corrupt the cache by mutating a returned array.

- [x] **Step 2: Run the boundary test to verify RED**

```sh
node --experimental-strip-types --test src/timeline/calendarBoundaries.test.js
```

Expected: FAIL because the boundary scanner does not exist.

- [x] **Step 3: Implement the cached Gregorian-day scanner**

Use this public shape:

```ts
export function calendarBoundaryDates(
  calendar: TimelineSecondaryCalendar,
  startDate: string,
  endDate: string,
  unit: "month" | "year",
): string[];
```

Scan inclusive Gregorian ISO days from `startDate` through `endDate`, compare each date’s registry key with the preceding Gregorian day, and collect the transition date. Cache by `${calendar}|${unit}|${startDate}|${endDate}` and return a copy. This keeps lunar and leap-month behavior in `Intl` while keeping date traversal deterministic.

- [x] **Step 4: Run focused tests and typecheck**

```sh
node --experimental-strip-types --test src/timeline/calendarBoundaries.test.js
npm run typecheck
```

Expected: PASS.

- [x] **Step 5: Commit the boundary slice**

```sh
git add src/timeline/calendarBoundaries.ts src/timeline/calendarBoundaries.test.js
git commit -m "feat: derive secondary calendar axis boundaries"
```

---

## Task 4: Replace Calendar Controls And Add Safe Runtime Fallback

**Files:**
- Modify: `src/features/timeline-editor/components/EditorSidebar.tsx`
- Modify: `src/features/timeline-editor/legacyTimelineEditor.js`
- Modify: `src/features/timeline-editor/timelineInfo.ts`
- Modify: `src/features/timeline-editor/timelineInfo.test.js`
- Modify: `styles.css`

- [x] **Step 1: Add failing generic display-surface tests**

Extend `timelineInfo.test.js` so placeholders and output are no longer Persian-specific:

```js
assert.equal(pointerInfoText(null, null, ["gregorian"]).iranianLabel, "Gregorian date");
assert.equal(pointerInfoText(null, null, ["hebrew"]).iranianLabel, "Hebrew date");
assert.equal(pointerInfoText(null, null, ["gregorian", "hebrew"]).iranianLabel, "Gregorian and Hebrew dates");
assert.equal(cursorReadoutText("1990-08-20", null, ["hebrew"], "2026-07-05").dateLabel, "29 Av 5750 AM");
```

The `iranianLabel` property may remain temporarily because it is an internal return-field name; all displayed text and formatter logic must be generic.

- [x] **Step 2: Run the focused test to verify RED**

```sh
node --experimental-strip-types --test src/features/timeline-editor/timelineInfo.test.js
```

Expected: FAIL because placeholders and date-line formatting only distinguish Gregorian and Iranian.

- [x] **Step 3: Render the new controls**

In `EditorSidebar.tsx`:

- Keep `displayGregorianInput`, default checked.
- Replace `displayIranianInput` with `secondaryCalendarInput`.
- Render `None` and all registry definitions in the select.
- Disable options for which `isCalendarRuntimeSupported(id)` is false.
- Add `calendarSupportWarning` with `role="status"`, hidden by default.

Use the exact visible labels from the design specification.

- [x] **Step 4: Update the legacy control bridge**

Replace Iranian-checkbox DOM wiring with the secondary select. `syncDisplayCalendarControls()` must derive its state from the stored normalized selection, not the effective fallback:

```js
const controlState = calendarControlState(currentDisplayCalendars());
dom.displayGregorianInput.checked = controlState.showGregorian;
dom.displayGregorianInput.disabled = controlState.gregorianDisabled;
dom.secondaryCalendarInput.value = controlState.secondary || "";
```

When a user changes controls, call `displayCalendarsFromControls(checked, selectedOrNull)`. When the selected secondary becomes None, force Gregorian checked and disabled. Changing secondary options must preserve the checkbox state.

Add `effectiveDisplayCalendars()` at rendering and display-text call sites. If a loaded recognized secondary is unsupported, leave `timeline.settings.displayCalendars` untouched, reveal the warning, and render `["gregorian"]`. Do not call history recording or timeline mutation from support synchronization.

- [x] **Step 5: Generalize timeline info placeholders**

Build placeholders from registry labels and use `formatDateForCalendars()` for every date line. Keep ordering Gregorian first, secondary second.

- [x] **Step 6: Add compact styling**

Keep the section visually aligned with existing `.legacy-select` and `.check-row` controls. Add a restrained warning style that remains readable in the existing light interface and does not change sidebar width.

- [x] **Step 7: Run focused tests, full tests, and typecheck**

```sh
node --experimental-strip-types --test src/features/timeline-editor/timelineInfo.test.js src/timeline/calendars.test.js src/timeline/calendarRegistry.test.js
npm test
npm run typecheck
```

Expected: all commands PASS.

- [x] **Step 8: Commit the controls slice**

```sh
git add src/features/timeline-editor/components/EditorSidebar.tsx src/features/timeline-editor/legacyTimelineEditor.js src/features/timeline-editor/timelineInfo.ts src/features/timeline-editor/timelineInfo.test.js styles.css
git commit -m "feat: add secondary calendar display controls"
```

---

## Task 5: Generalize Axis Labels, Grid Lines, And Bands

**Files:**
- Modify: `src/features/timeline-editor/legacyTimelineEditor.js`
- Modify: `src/timeline/formatters.ts`
- Modify: `src/timeline/formatters.test.js`

- [x] **Step 1: Add failing axis-format helper tests**

Add formatter tests for the generic helpers consumed by the renderer:

```js
assert.equal(calendarYearLabel("1990-08-20", "hebrew"), "5750 AM");
assert.equal(calendarMonthLabel("1990-08-20", "hebrew"), "Av");
assert.equal(calendarDayLabel("1990-08-20", "hebrew"), "29");
```

Also assert Japanese year labels include the era, because numeric years repeat across eras.

- [x] **Step 2: Run the focused formatter test to verify RED**

```sh
node --experimental-strip-types --test src/timeline/formatters.test.js
```

Expected: FAIL because generic axis helpers are not exported.

- [x] **Step 3: Add generic axis formatting helpers**

Expose registry-backed `calendarYearLabel`, `calendarMonthLabel`, and `calendarDayLabel` through `formatters.ts`, or import them directly from the registry if that produces a cleaner dependency direction. Keep Gregorian helpers separate because Gregorian remains the default axis.

- [x] **Step 4: Replace the Persian-only axis branch**

In `legacyTimelineEditor.js`:

- Replace `usesIranianAxis()` with `secondaryAxisCalendar()` returning the selected secondary only when Gregorian is absent.
- Replace `iranianMonthStartDates()` and Persian date-part caches with `calendarBoundaryDates()` and registry date parts.
- In `drawTimeBands()`, use secondary month transitions only in secondary-only mode; retain Gregorian bands whenever Gregorian is visible.
- In `drawGrid()`, use the secondary calendar’s day labels, month boundaries, year boundaries, and labels in secondary-only mode.
- In Gregorian-visible dual mode, retain Gregorian boundaries and stack the selected secondary month/date text below Gregorian text when collision rules allow.
- Preserve current `axisDetailForZoom`, `canPlaceAxisLabel`, date-to-X mapping, SVG path batching, and vertical render bounds.

Build month cells from each boundary and the next boundary so Hebrew leap months and variable Islamic month lengths receive their actual widths. Use year-boundary membership rather than assuming month number `1` is always sufficient.

- [x] **Step 5: Remove obsolete Persian renderer helpers**

After all call sites migrate, delete the local Persian month-start cache and imports that are no longer used. Retain public compatibility wrappers in `formatters.ts` only if tests or non-renderer code still call them.

- [x] **Step 6: Run automated verification**

```sh
node --check src/features/timeline-editor/legacyTimelineEditor.js
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: all commands PASS and the production build completes.

- [x] **Step 7: Commit the renderer slice**

```sh
git add src/features/timeline-editor/legacyTimelineEditor.js src/timeline/formatters.ts src/timeline/formatters.test.js
git commit -m "feat: render secondary calendar timeline axes"
```

---

## Task 6: Browser Smoke And Persistence Verification

**Files:**
- Modify: `docs/workflows/browser-smoke.md`
- Modify only if a discovered defect requires it: files from Tasks 1-5

- [x] **Step 1: Start the app**

```sh
npm run dev -- --port 8765
```

Open `http://127.0.0.1:8765/`.

- [x] **Step 2: Verify control behavior**

Check:

- New timeline shows Gregorian checked, disabled, and Secondary None.
- Choosing each supported secondary enables Gregorian and initially shows dual output.
- Unchecking Gregorian produces secondary-only output.
- Switching Persian-only to Hebrew keeps Gregorian off.
- Choosing None forces Gregorian on and disables its checkbox.
- Unsupported options, if any in the current browser, are disabled.

- [x] **Step 3: Verify every display surface**

For Gregorian-only, dual, and secondary-only modes, inspect:

- Header range and cursor readout.
- Selected item and item date preview.
- Year/month/day axis labels, grid lines, and alternating bands.
- Zoom transitions and label collision behavior.
- SVG, PNG, and PDF exports.
- No console errors.

- [x] **Step 4: Verify persistence compatibility**

Save and reload Gregorian-only, Gregorian/Hebrew, and Hebrew-only JSON. Load an existing `iranian` JSON and confirm it retains Persian display. Manually set a recognized unsupported ID only if the current runtime exposes an unsupported calendar; otherwise rely on the injected unit test for this branch.

Confirm display-only changes participate in normal undo/redo and unsaved-state tracking, while automatic runtime fallback does not create an undo entry or dirty state.

- [x] **Step 5: Record the smoke checklist**

Add these exact cases to `docs/workflows/browser-smoke.md` and record date/browser/results. Fix any observed regression with a failing automated test where practical before rerunning the relevant checks.

- [x] **Step 6: Commit smoke documentation and any fixes**

```sh
git add docs/workflows/browser-smoke.md
git commit -m "test: document secondary calendar browser smoke"
```

If fixes were necessary, include only the directly related files in this commit and explain them in the commit body.

---

## Task 7: Close Documentation And Run Final Verification

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/plan.md`
- Modify: `docs/handoff.md`

- [x] **Step 1: Update user and maintainer documentation**

- Replace Gregorian/Persian-only capability wording in `README.md` with Gregorian plus one optional supported secondary calendar.
- Add the feature to the Unreleased section of `CHANGELOG.md`.
- Mark the calendar feature complete in `docs/plan.md` and leave only the next actionable priority.
- Record architecture, compatibility behavior, touched modules, tests, browser smoke, and residual risks in `docs/handoff.md` without repeating old completed work.

- [x] **Step 2: Run final verification from a clean app process**

```sh
node --check src/features/timeline-editor/legacyTimelineEditor.js
npm test
npm run typecheck
npm run build
git diff --check
git status --short
```

Expected:

- Syntax check passes.
- Entire test suite passes.
- Typecheck passes.
- Production build succeeds.
- No whitespace errors.
- Status contains only intended feature/documentation changes before commit.

- [x] **Step 3: Review the final diff against the approved design**

Confirm every supported calendar is selectable and tested, only one secondary is persisted, unsupported fallback is non-mutating, Gregorian storage is unchanged, all display surfaces use the effective selection, and no localization or non-Gregorian input scope was introduced.

- [x] **Step 4: Commit closeout documentation**

```sh
git add README.md CHANGELOG.md docs/plan.md docs/handoff.md
git commit -m "docs: close selectable calendar feature"
```

- [x] **Step 5: Capture the final evidence**

Record the final commit range and exact verification results in the task closeout. Do not claim browser smoke passed unless it was actually performed.
