import assert from "node:assert/strict";
import test from "node:test";

import {
  calendarControlState,
  displayCalendarsFromControls,
  normalizeDisplayCalendars,
} from "./calendars.ts";

test("display calendars normalize one secondary selection in stable order", () => {
  assert.deepEqual(
    normalizeDisplayCalendars(["hebrew", "gregorian", "iranian"]),
    ["gregorian", "hebrew"],
  );
  assert.deepEqual(normalizeDisplayCalendars(["iranian"]), ["iranian"]);
});

test("display calendars fall back to Gregorian when missing or invalid", () => {
  assert.deepEqual(normalizeDisplayCalendars(["unknown"]), ["gregorian"]);
  assert.deepEqual(normalizeDisplayCalendars([]), ["gregorian"]);
});

test("calendar controls keep Gregorian selected when there is no secondary", () => {
  assert.deepEqual(calendarControlState(["gregorian"]), {
    showGregorian: true,
    secondary: null,
    gregorianDisabled: true,
  });
});

test("calendar controls allow a secondary-only display", () => {
  assert.deepEqual(calendarControlState(["hebrew"]), {
    showGregorian: false,
    secondary: "hebrew",
    gregorianDisabled: false,
  });
  assert.deepEqual(displayCalendarsFromControls(false, null), ["gregorian"]);
  assert.deepEqual(displayCalendarsFromControls(false, "hebrew"), ["hebrew"]);
});
