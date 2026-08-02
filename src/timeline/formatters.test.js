import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDateForCalendars,
  formatIranianDate,
  iranianDay,
  iranianDateParts,
  iranianYear,
} from "./formatters.ts";

test("date display follows selected calendars", () => {
  assert.equal(formatDateForCalendars("1990-08-20", ["gregorian"]), "Aug 20, 1990");
  assert.equal(formatDateForCalendars("1990-08-20", ["iranian"]), "29 Mordad 1369");
  assert.equal(formatDateForCalendars("1990-08-20", ["gregorian", "iranian"]), "Aug 20, 1990 / 29 Mordad 1369");
  assert.equal(formatDateForCalendars("1990-08-20", ["gregorian", "hebrew"]), "Aug 20, 1990 / 29 Av 5750 AM");
});

test("Iranian formatter remains available as a compatibility wrapper", () => {
  assert.equal(formatIranianDate("1990-08-20"), "29 Mordad 1369");
});

test("iranian compact date parts are available for axis labels", () => {
  assert.equal(iranianYear("1990-08-20"), "1369");
  assert.equal(iranianDay("1990-08-20"), "29");
  assert.deepEqual(iranianDateParts("1990-08-20"), { year: 1369, month: 5, day: 29 });
});
