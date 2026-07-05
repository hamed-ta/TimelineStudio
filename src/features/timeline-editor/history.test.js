import assert from "node:assert/strict";
import test from "node:test";

import {
  createTimelineHistory,
  createTimelineHistoryEntry,
  hasUnsavedTimelineChanges,
  recordTimelineChange,
  redoTimelineChange,
  TIMELINE_HISTORY_LIMIT,
  undoTimelineChange,
} from "./history.ts";

test("timeline history keeps only the most recent 25 undo entries", () => {
  let history = createTimelineHistory("saved");

  for (let index = 0; index < TIMELINE_HISTORY_LIMIT + 5; index += 1) {
    history = recordTimelineChange(
      history,
      createTimelineHistoryEntry(`snapshot-${index}`, `selected-${index}`),
    );
  }

  assert.equal(history.undoStack.length, TIMELINE_HISTORY_LIMIT);
  assert.deepEqual(history.undoStack[0], {
    snapshot: "snapshot-5",
    selectedId: "selected-5",
  });
  assert.deepEqual(history.undoStack.at(-1), {
    snapshot: "snapshot-29",
    selectedId: "selected-29",
  });
});

test("undo and redo move timeline history entries between stacks", () => {
  let history = createTimelineHistory("saved");
  history = recordTimelineChange(history, createTimelineHistoryEntry("saved", "home"));
  history = recordTimelineChange(history, createTimelineHistoryEntry("v1", "event"));

  const undoResult = undoTimelineChange(history, createTimelineHistoryEntry("v2", "note"));
  assert.deepEqual(undoResult.entry, {
    snapshot: "v1",
    selectedId: "event",
  });
  assert.deepEqual(undoResult.history.redoStack, [{
    snapshot: "v2",
    selectedId: "note",
  }]);

  const redoResult = redoTimelineChange(
    undoResult.history,
    createTimelineHistoryEntry("v1", "event"),
  );
  assert.deepEqual(redoResult.entry, {
    snapshot: "v2",
    selectedId: "note",
  });
  assert.deepEqual(redoResult.history.undoStack.at(-1), {
    snapshot: "v1",
    selectedId: "event",
  });
});

test("undo can return the timeline to the saved snapshot and clear dirty state", () => {
  let history = createTimelineHistory("saved");
  history = recordTimelineChange(history, createTimelineHistoryEntry("saved", "home"));

  assert.equal(hasUnsavedTimelineChanges(history, "changed"), true);

  const undoResult = undoTimelineChange(history, createTimelineHistoryEntry("changed", "event"));

  assert.equal(hasUnsavedTimelineChanges(undoResult.history, undoResult.entry.snapshot), false);
  assert.deepEqual(undoResult.entry, {
    snapshot: "saved",
    selectedId: "home",
  });
});

test("recording a new change clears redo history", () => {
  let history = createTimelineHistory("saved");
  history = recordTimelineChange(history, createTimelineHistoryEntry("saved", "home"));

  const undoResult = undoTimelineChange(history, createTimelineHistoryEntry("changed", "event"));
  const nextHistory = recordTimelineChange(
    undoResult.history,
    createTimelineHistoryEntry("saved", "home"),
  );

  assert.equal(nextHistory.redoStack.length, 0);
});
