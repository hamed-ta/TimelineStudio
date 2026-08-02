import assert from "node:assert/strict";
import test from "node:test";

import { calendarBoundaryDates } from "./calendarBoundaries.ts";
import { SECONDARY_CALENDAR_IDS } from "./calendars.ts";
import { formatCalendarParts } from "./calendarRegistry.ts";
import { addDaysIso, daysBetween } from "./dates.ts";

const RANGE_START = "2024-01-01";
const RANGE_END = "2024-12-31";

for (const calendar of SECONDARY_CALENDAR_IDS) {
  for (const unit of ["month", "year"]) {
    test(`${calendar} ${unit} boundaries change the corresponding registry key`, () => {
      const boundaries = calendarBoundaryDates(calendar, RANGE_START, RANGE_END, unit);

      assert.ok(boundaries.length > 0);
      for (const boundary of boundaries) {
        const previousDate = addDaysIso(boundary, -1);
        const key = unit === "month" ? "monthKey" : "yearKey";
        assert.notEqual(
          formatCalendarParts(boundary, calendar)[key],
          formatCalendarParts(previousDate, calendar)[key],
        );
      }
    });
  }
}

test("Iranian year boundary includes Nowruz", () => {
  assert.ok(
    calendarBoundaryDates("iranian", "2026-03-15", "2026-03-28", "year").includes("2026-03-21"),
  );
});

test("Umm al-Qura month boundaries retain non-30-day Gregorian month lengths", () => {
  const boundaries = calendarBoundaryDates("islamic-umalqura", "2024-01-01", "2024-06-30", "month");

  assert.ok(boundaries.length >= 3);
  const lengths = boundaries.slice(1).map((boundary, index) => daysBetween(boundaries[index], boundary));
  assert.ok(lengths.some((length) => length !== 30));
});

test("Hebrew month boundaries include both leap-month labels", () => {
  const labels = calendarBoundaryDates("hebrew", "2023-08-01", "2024-05-31", "month")
    .map((boundary) => formatCalendarParts(boundary, "hebrew").month);

  assert.ok(labels.includes("Adar I"));
  assert.ok(labels.includes("Adar II"));
});

test("calendar boundary results are cache-isolated copies", () => {
  const first = calendarBoundaryDates("iranian", "2026-01-01", "2026-12-31", "month");
  const expected = [...first];
  first.pop();

  assert.deepEqual(calendarBoundaryDates("iranian", "2026-01-01", "2026-12-31", "month"), expected);
});
