import assert from "node:assert/strict";
import test from "node:test";

import {
  effectiveDisplayCalendars,
  formatCalendarDate,
} from "./calendarRegistry.ts";

const CALENDAR_DATES = [
  ["iranian", "29 Mordad 1369"],
  ["islamic-umalqura", "29 Muharram 1411 AH"],
  ["hebrew", "29 Av 5750 AM"],
  ["buddhist", "20 August 2533 BE"],
  ["japanese", "20 August 2 Heisei"],
  ["indian", "29 Sravana 1912 Saka"],
];

test("calendar registry formats every supported calendar with Latin digits", () => {
  for (const [calendar, expected] of CALENDAR_DATES) {
    const formatted = formatCalendarDate("1990-08-20", calendar);
    assert.equal(formatted, expected);
    assert.match(formatted, /[0-9]/);
    assert.doesNotMatch(formatted, /[\u0660-\u0669\u06f0-\u06f9]/);
  }
});

test("effective display calendars use Gregorian when a secondary calendar is unsupported", () => {
  assert.deepEqual(effectiveDisplayCalendars(["gregorian", "hebrew"], () => true), ["gregorian", "hebrew"]);
  assert.deepEqual(effectiveDisplayCalendars(["hebrew"], () => false), ["gregorian"]);
  assert.deepEqual(effectiveDisplayCalendars(["gregorian", "hebrew"], () => false), ["gregorian"]);
});
