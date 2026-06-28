import assert from "node:assert/strict";
import test from "node:test";

import {
  selectCanCreateOrPasteItems,
  selectIsItemReadOnly,
  selectItemById,
  selectLaneCount,
  selectPrimaryBirthItem,
  selectSelectedItem,
} from "./timelineSelectors.ts";

function createState() {
  const timeline = {
    version: 2,
    settings: {
      title: "Test Timeline",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      autoEndDate: false,
      itemsLocked: false,
      snap: "month",
      rowHeight: 68,
      laneLabels: ["Home", "Education"],
      laneColors: ["", ""],
    },
    items: [
      createItem("event", "event", 0, "2026-03-01"),
      createItem("later-birth", "birth", 0, "2001-01-01"),
      createItem("early-birth", "birth", 0, "1987-07-13"),
      createItem("far-lane", "period", 4, "2026-04-01"),
    ],
  };
  return {
    timeline,
    selectedId: "event",
    copiedItem: null,
    hasUnsavedChanges: false,
  };
}

function createItem(id, type, lane, startDate) {
  return {
    id,
    type,
    lane,
    startDate,
    endDate: startDate,
    title: id,
    color: "#3b82f6",
    notes: "",
    locked: false,
    showAgeLabels: true,
    showDurationLabel: true,
  };
}

test("timeline selectors find selected and arbitrary items", () => {
  const state = createState();

  assert.equal(selectSelectedItem(state).id, "event");
  assert.equal(selectItemById(state.timeline, "far-lane").id, "far-lane");
  assert.equal(selectItemById(state.timeline, "missing"), null);
});

test("timeline selectors choose the earliest birth item", () => {
  assert.equal(selectPrimaryBirthItem(createState().timeline).id, "early-birth");
});

test("timeline selectors derive lane count from labels and assigned items", () => {
  assert.equal(selectLaneCount(createState().timeline), 5);
});

test("timeline selectors derive creation and item read-only state", () => {
  const state = createState();
  const item = selectSelectedItem(state);

  assert.equal(selectCanCreateOrPasteItems(state), true);
  assert.equal(selectIsItemReadOnly(state, item), false);

  const lockedState = {
    ...state,
    timeline: {
      ...state.timeline,
      settings: {
        ...state.timeline.settings,
        itemsLocked: true,
      },
    },
  };
  assert.equal(selectCanCreateOrPasteItems(lockedState), false);
  assert.equal(selectIsItemReadOnly(lockedState, item), true);

  assert.equal(selectIsItemReadOnly(state, { ...item, locked: true }), true);
});
