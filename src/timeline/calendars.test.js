import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeDisplayCalendars,
} from "./calendars.ts";

test("display calendars normalize valid selections in stable order", () => {
  assert.deepEqual(normalizeDisplayCalendars(["iranian", "gregorian", "iranian"]), ["gregorian", "iranian"]);
  assert.deepEqual(normalizeDisplayCalendars("iranian"), ["iranian"]);
  assert.deepEqual(normalizeDisplayCalendars(["gregorian"]), ["gregorian"]);
});

test("display calendars fall back to both calendars when missing or invalid", () => {
  assert.deepEqual(normalizeDisplayCalendars(undefined), ["gregorian", "iranian"]);
  assert.deepEqual(normalizeDisplayCalendars([]), ["gregorian", "iranian"]);
  assert.deepEqual(normalizeDisplayCalendars(["lunar"]), ["gregorian", "iranian"]);
});
