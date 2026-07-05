import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmptyTimeline,
  normalizeTimeline,
} from "./model.ts";
import {
  addYearsIso,
  todayIso,
} from "./dates.ts";

test("new timelines display Gregorian and Persian calendars by default", () => {
  assert.deepEqual(createEmptyTimeline().settings.displayCalendars, ["gregorian", "iranian"]);
});

test("new timelines default to the last year ending today", () => {
  const today = todayIso();
  const timeline = createEmptyTimeline();

  assert.equal(timeline.settings.startDate, addYearsIso(today, -1));
  assert.equal(timeline.settings.endDate, today);
  assert.equal(timeline.settings.autoEndDate, true);
});

test("timeline normalization preserves or repairs display calendar settings", () => {
  assert.deepEqual(normalizeTimeline({ settings: {} }).settings.displayCalendars, ["gregorian", "iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["iranian"] } }).settings.displayCalendars, ["iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["unknown"] } }).settings.displayCalendars, ["gregorian", "iranian"]);
});

test("timeline normalization preserves note and marker callout offsets", () => {
  const timeline = normalizeTimeline({
    items: [
      {
        id: "note-1",
        type: "note",
        startDate: "2026-01-01",
        noteOffsetY: -120,
      },
      {
        id: "marker-1",
        type: "marker",
        startDate: "2026-01-02",
        labelOffsetX: 40,
        labelOffsetY: -72,
        labelWidth: 180,
        labelHeight: 88,
      },
    ],
  });

  assert.equal(timeline.items[0].noteOffsetY, -120);
  assert.equal(timeline.items[1].labelOffsetX, 40);
  assert.equal(timeline.items[1].labelOffsetY, -72);
  assert.equal(timeline.items[1].labelWidth, 180);
  assert.equal(timeline.items[1].labelHeight, 88);
});
