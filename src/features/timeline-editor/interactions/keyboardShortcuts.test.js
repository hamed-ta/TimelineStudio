import assert from "node:assert/strict";
import test from "node:test";

import {
  EDITABLE_SHORTCUT_TARGET_SELECTOR,
  hasShortcutModifier,
  isEditableShortcutTarget,
  isRedoShortcut,
  isUndoShortcut,
} from "./keyboardShortcuts.ts";

function targetThatMatches(matches) {
  return {
    closest(selector) {
      assert.equal(selector, EDITABLE_SHORTCUT_TARGET_SELECTOR);
      return matches ? { nodeName: "TEXTAREA" } : null;
    },
  };
}

test("editable shortcut target returns true for nested editable controls", () => {
  assert.equal(isEditableShortcutTarget(targetThatMatches(true)), true);
});

test("editable shortcut target returns false outside editor controls", () => {
  assert.equal(isEditableShortcutTarget(targetThatMatches(false)), false);
});

test("editable shortcut target tolerates non-element event targets", () => {
  assert.equal(isEditableShortcutTarget(null), false);
  assert.equal(isEditableShortcutTarget({}), false);
});

test("shortcut modifier requires ctrl or command without alt", () => {
  assert.equal(hasShortcutModifier({ key: "s", ctrlKey: true }), true);
  assert.equal(hasShortcutModifier({ key: "s", metaKey: true }), true);
  assert.equal(hasShortcutModifier({ key: "s", ctrlKey: true, altKey: true }), false);
});

test("undo shortcut matches ctrl or command z without shift", () => {
  assert.equal(isUndoShortcut({ key: "z", ctrlKey: true }), true);
  assert.equal(isUndoShortcut({ key: "Z", metaKey: true }), true);
  assert.equal(isUndoShortcut({ key: "z", ctrlKey: true, shiftKey: true }), false);
});

test("redo shortcut matches ctrl or command y without shift", () => {
  assert.equal(isRedoShortcut({ key: "y", ctrlKey: true }), true);
  assert.equal(isRedoShortcut({ key: "Y", metaKey: true }), true);
  assert.equal(isRedoShortcut({ key: "y", ctrlKey: true, shiftKey: true }), false);
});
