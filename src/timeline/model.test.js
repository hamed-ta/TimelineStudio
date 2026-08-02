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

test("new timelines display Gregorian only by default", () => {
  assert.deepEqual(createEmptyTimeline().settings.displayCalendars, ["gregorian"]);
});

test("new timelines default to the last year ending today", () => {
  const today = todayIso();
  const timeline = createEmptyTimeline();

  assert.equal(timeline.settings.startDate, addYearsIso(today, -1));
  assert.equal(timeline.settings.endDate, today);
  assert.equal(timeline.settings.autoEndDate, true);
});

test("new timelines start with six stable line names arranged top to bottom", () => {
  const labels = createEmptyTimeline().settings.laneLabels;
  assert.deepEqual(labels, [
    "Line 3",
    "Line 4",
    "Line 2",
    "Line 5",
    "Line 1",
    "Line 6",
  ]);
  assert.deepEqual([labels[4], labels[2], labels[0], labels[1], labels[3], labels[5]], [
    "Line 1",
    "Line 2",
    "Line 3",
    "Line 4",
    "Line 5",
    "Line 6",
  ]);
});

test("timeline normalization preserves or repairs display calendar settings", () => {
  assert.deepEqual(normalizeTimeline({ settings: {} }).settings.displayCalendars, ["gregorian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["iranian"] } }).settings.displayCalendars, ["iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["gregorian", "iranian"] } }).settings.displayCalendars, ["gregorian", "iranian"]);
  assert.deepEqual(normalizeTimeline({ settings: { displayCalendars: ["unknown"] } }).settings.displayCalendars, ["gregorian"]);
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
