import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmptyTimeline,
  normalizeTimeline,
} from "./model.ts";

test("new timelines display Gregorian and Persian calendars by default", () => {
  assert.deepEqual(createEmptyTimeline().settings.displayCalendars, ["gregorian", "iranian"]);
});

test("timeline normalization preserves or repairs display calendar settings", () => {
  assert.deepEqual(normalizeTimeline({ settings: {} }).settings.displayCalendars, ["gregorian", "iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["iranian"] } }).settings.displayCalendars, ["iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["unknown"] } }).settings.displayCalendars, ["gregorian", "iranian"]);
});
