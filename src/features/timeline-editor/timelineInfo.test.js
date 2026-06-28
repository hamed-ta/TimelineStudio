import assert from "node:assert/strict";
import test from "node:test";

import {
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
    iranianLabel: "Gregorian and Iranian dates",
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

test("selection info formats period dates duration line and age range", () => {
  assert.deepEqual(selectionInfoText(period, "1987-07-13"), {
    itemLabel: "Period: School - Line 2",
    dateLine: "Start: Jul 13, 1987 / 22 Tir 1366",
    endLine: "End: Aug 20, 1990 / 29 Mordad 1369",
    durationLine: "Duration: 3 years, 1 month, 7 days",
    ageLine: "Age: 0 days to 3 years, 1 month, 7 days",
  });
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
    dateLine: "Select an item to inspect dates",
    endLine: "",
    durationLine: "",
    ageLine: "",
  });
  assert.equal(itemTypeLabel("birth"), "Birth");
  assert.equal(itemTypeLabel("unknown"), "Item");
});
