import assert from "node:assert/strict";
import test from "node:test";

import {
  timelineReducer,
} from "./timelineReducer.ts";

function createState() {
  return {
    timeline: {
      version: 2,
      settings: {
        title: "Test Timeline",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        autoEndDate: false,
        itemsLocked: false,
        snap: "month",
        rowHeight: 68,
        laneLabels: ["Home", "Education", "Events"],
        laneColors: ["#111111", "", "#333333"],
      },
      items: [
        createItem("home", 0),
        createItem("school", 1),
        createItem("event", 2),
      ],
    },
    selectedId: "school",
    copiedItem: null,
    hasUnsavedChanges: false,
  };
}

function createItem(id, lane) {
  return {
    id,
    type: "period",
    lane,
    startDate: "2026-01-01",
    endDate: "2026-02-01",
    title: id,
    color: "#3b82f6",
    notes: "",
    locked: false,
    showAgeLabels: true,
    showDurationLabel: true,
  };
}

test("timeline reducer updates settings and marks the state dirty", () => {
  const state = createState();
  const next = timelineReducer(state, {
    type: "updateSettings",
    settings: { title: "Updated", itemsLocked: true },
  });

  assert.equal(next.timeline.settings.title, "Updated");
  assert.equal(next.timeline.settings.itemsLocked, true);
  assert.equal(next.hasUnsavedChanges, true);
  assert.notEqual(next, state);
});

test("timeline reducer adds an item and selects it by default", () => {
  const state = createState();
  const item = createItem("added", 1);
  const next = timelineReducer(state, { type: "addItem", item });

  assert.equal(next.timeline.items.at(-1).id, "added");
  assert.equal(next.selectedId, "added");
  assert.equal(next.hasUnsavedChanges, true);
});

test("timeline reducer updates only the matching item", () => {
  const state = createState();
  const next = timelineReducer(state, {
    type: "updateItem",
    itemId: "school",
    changes: { title: "Updated school" },
  });

  assert.equal(next.timeline.items.find((item) => item.id === "school").title, "Updated school");
  assert.equal(next.timeline.items.find((item) => item.id === "home").title, "home");
  assert.equal(next.hasUnsavedChanges, true);
});

test("timeline reducer deletes an item and clears selection when needed", () => {
  const state = createState();
  const next = timelineReducer(state, { type: "deleteItem", itemId: "school" });

  assert.deepEqual(next.timeline.items.map((item) => item.id), ["home", "event"]);
  assert.equal(next.selectedId, null);
  assert.equal(next.hasUnsavedChanges, true);
});

test("timeline reducer reorders lanes, labels, colors, and assigned items", () => {
  const state = createState();
  const next = timelineReducer(state, { type: "reorderLane", fromIndex: 0, toIndex: 2 });

  assert.deepEqual(next.timeline.settings.laneLabels, ["Education", "Events", "Home"]);
  assert.deepEqual(next.timeline.settings.laneColors, ["", "#333333", "#111111"]);
  assert.deepEqual(next.timeline.items.map((item) => [item.id, item.lane]), [
    ["home", 2],
    ["school", 0],
    ["event", 1],
  ]);
  assert.equal(next.hasUnsavedChanges, true);
});

test("timeline reducer removes a lane, removes its items, and shifts later items", () => {
  const state = createState();
  const next = timelineReducer(state, { type: "removeLane", laneIndex: 1 });

  assert.deepEqual(next.timeline.settings.laneLabels, ["Home", "Events"]);
  assert.deepEqual(next.timeline.settings.laneColors, ["#111111", "#333333"]);
  assert.deepEqual(next.timeline.items.map((item) => [item.id, item.lane]), [
    ["home", 0],
    ["event", 1],
  ]);
  assert.equal(next.selectedId, null);
  assert.equal(next.hasUnsavedChanges, true);
});

test("timeline reducer copies an item without marking document data dirty", () => {
  const state = createState();
  const next = timelineReducer(state, { type: "copyItem", itemId: "school" });

  assert.deepEqual(next.copiedItem, state.timeline.items[1]);
  assert.equal(next.hasUnsavedChanges, false);
});
