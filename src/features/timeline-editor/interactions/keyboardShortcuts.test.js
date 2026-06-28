import assert from "node:assert/strict";
import test from "node:test";

import {
  EDITABLE_SHORTCUT_TARGET_SELECTOR,
  isEditableShortcutTarget,
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
