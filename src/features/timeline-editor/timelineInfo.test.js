import assert from "node:assert/strict";
import test from "node:test";

import {
  cursorReadoutText,
  itemTypeLabel,
  pointerInfoText,
  selectionInfoText,
} from "./timelineInfo.ts";

const period = {
  type: "period",
  title: "School",
  lane: 1,
  startDate: "1987-07-13",
  endDate: "1990-08-20",
  locked: false,
  notes: "",
};

test("pointer info shows placeholders until a date is hovered", () => {
  assert.deepEqual(pointerInfoText(null, null), {
    dateLabel: "Hover over the timeline",
    iranianLabel: "Gregorian and Persian dates",
    ageLabel: "Add a birth item to calculate age",
  });
  assert.equal(pointerInfoText(null, "1987-07-13").ageLabel, "Age appears here");
});

test("pointer info formats hovered dates and age labels", () => {
  assert.deepEqual(pointerInfoText("1990-08-20", "1987-07-13"), {
    dateLabel: "Aug 20, 1990",
    iranianLabel: "29 Mordad 1369",
    ageLabel: "Age 3 years, 1 month, 7 days",
  });
});

test("pointer info follows selected display calendars", () => {
  assert.deepEqual(pointerInfoText("1990-08-20", null, ["gregorian"]), {
    dateLabel: "Aug 20, 1990",
    iranianLabel: "",
    ageLabel: "Age: add a birth item",
  });
  assert.deepEqual(pointerInfoText("1990-08-20", null, ["iranian"]), {
    dateLabel: "29 Mordad 1369",
    iranianLabel: "",
    ageLabel: "Age: add a birth item",
  });
});

test("cursor readout shows relative date age and selected calendars", () => {
  assert.deepEqual(cursorReadoutText("2003-04-01", "1987-07-13", ["gregorian"], "2026-07-05"), {
    agoLabel: "23 years \u20073 months \u20074 days ago",
    ageLabel: "Age 15 years, \u20078 months, 19 days",
    dateLabel: "Apr 1, 2003",
  });
});

test("cursor readout handles future dates and missing birth date", () => {
  assert.deepEqual(cursorReadoutText("2027-08-06", null, ["gregorian"], "2026-07-05"), {
    agoLabel: "in \u20071 year \u20071 month \u20071 day",
    ageLabel: "Age unavailable",
    dateLabel: "Aug 6, 2027",
  });
});

test("cursor readout reserves digit width for single-digit values", () => {
  assert.deepEqual(cursorReadoutText("2025-03-08", "2024-02-01", ["gregorian"], "2026-07-05"), {
    agoLabel: "\u20071 year \u20073 months 27 days ago",
    ageLabel: "Age \u20071 year, \u20071 month, \u20077 days",
    dateLabel: "Mar 8, 2025",
  });
});

test("selection info formats period dates duration line and age range", () => {
  assert.deepEqual(selectionInfoText(period, "1987-07-13"), {
    itemLabel: "Period: School",
    lineLine: "Line: Line 2",
    dateLine: "Start: Jul 13, 1987 / 22 Tir 1366",
    endLine: "End: Aug 20, 1990 / 29 Mordad 1369",
    durationLine: "Duration: 3 years, 1 month, 7 days",
    ageLine: "Age: 0 days to 3 years, 1 month, 7 days",
  });
});

test("selection info follows selected display calendars", () => {
  assert.equal(selectionInfoText(period, null, ["gregorian"]).dateLine, "Start: Jul 13, 1987");
  assert.equal(selectionInfoText(period, null, ["iranian"]).dateLine, "Start: 22 Tir 1366");
  assert.equal(selectionInfoText(period, null, ["iranian"]).lineLine, "Line: Line 2");
  assert.equal(selectionInfoText(period, null, ["gregorian"], ["Home", "Education"]).lineLine, "Line: Education");
});

test("selection info formats notes without line metadata", () => {
  assert.equal(selectionInfoText({
    type: "note",
    title: "",
    lane: 2,
    startDate: "1990-08-20",
    endDate: "1990-08-20",
    locked: true,
    notes: "\nInline note\nsecond",
  }, null).itemLabel, "Locked - Note: Inline note");
});

test("selection info provides empty-state text and known item labels", () => {
  assert.deepEqual(selectionInfoText(null), {
    itemLabel: "No item selected",
    lineLine: "",
    dateLine: "Select an item to inspect dates",
    endLine: "",
    durationLine: "",
    ageLine: "",
  });
  assert.equal(itemTypeLabel("birth"), "Birth");
  assert.equal(itemTypeLabel("unknown"), "Item");
});
