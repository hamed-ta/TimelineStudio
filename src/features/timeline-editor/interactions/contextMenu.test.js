import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveTimelineContextMenuState,
} from "./contextMenu.ts";

test("context menu state enables add paste and selected-item actions when editable", () => {
  assert.deepEqual(deriveTimelineContextMenuState({
    hasSelection: true,
    allItemsLocked: false,
    selectedItemLocked: false,
    hasCopiedItem: true,
  }), {
    addItemsDisabled: false,
    actions: {
      "add-menu": { disabled: false },
      copy: { disabled: false },
      paste: { disabled: false },
      duplicate: { disabled: false },
      delete: { disabled: false },
      "lock-item": { disabled: false, hidden: false },
      "unlock-item": { disabled: false, hidden: true },
    },
  });
});

test("context menu state disables mutation commands in read-only mode", () => {
  const state = deriveTimelineContextMenuState({
    hasSelection: true,
    allItemsLocked: true,
    selectedItemLocked: false,
    hasCopiedItem: true,
  });

  assert.equal(state.addItemsDisabled, true);
  assert.equal(state.actions["add-menu"].disabled, true);
  assert.equal(state.actions.paste.disabled, true);
  assert.equal(state.actions.duplicate.disabled, true);
  assert.equal(state.actions.delete.disabled, true);
  assert.equal(state.actions.copy.disabled, false);
});

test("context menu state swaps lock actions for locked selected items", () => {
  const state = deriveTimelineContextMenuState({
    hasSelection: true,
    allItemsLocked: false,
    selectedItemLocked: true,
    hasCopiedItem: false,
  });

  assert.equal(state.actions["lock-item"].hidden, true);
  assert.equal(state.actions["unlock-item"].hidden, false);
  assert.equal(state.actions.duplicate.disabled, true);
  assert.equal(state.actions.delete.disabled, true);
});

test("context menu state disables selection commands when nothing is selected", () => {
  const state = deriveTimelineContextMenuState({
    hasSelection: false,
    allItemsLocked: false,
    selectedItemLocked: false,
    hasCopiedItem: false,
  });

  assert.equal(state.actions.copy.disabled, true);
  assert.equal(state.actions.duplicate.disabled, true);
  assert.equal(state.actions.delete.disabled, true);
  assert.equal(state.actions["lock-item"].disabled, true);
  assert.equal(state.actions["unlock-item"].disabled, true);
});
