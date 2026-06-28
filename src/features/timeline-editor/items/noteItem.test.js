import assert from "node:assert/strict";
import test from "node:test";

import {
  hasFiniteNumber,
  noteBorderColor,
  noteDisplayText,
  noteSizeForItem,
  noteTextColorForItem,
  noteTitleFromText,
} from "./noteItem.ts";

const sizeOptions = {
  defaultWidth: 196,
  defaultHeight: 50,
  minWidth: 84,
  maxWidth: 420,
  minHeight: 44,
  maxHeight: 280,
  paddingX: 9,
  tipHeight: 7,
  textVerticalPadding: 8,
  lineHeight: 17,
  measureText: (text) => String(text).length * 8,
};

test("note display text falls back from notes to title to the note type title", () => {
  assert.equal(noteDisplayText({ notes: "  First line  ", title: "Title" }), "First line");
  assert.equal(noteDisplayText({ notes: "", title: "Title" }), "Title");
  assert.equal(noteDisplayText({ notes: "", title: "" }), "Note");
});

test("note title is derived from the first non-empty text line", () => {
  assert.equal(noteTitleFromText("\n  First useful line\nSecond"), "First useful line");
  assert.equal(noteTitleFromText(""), "Note");
  assert.equal(noteTitleFromText("x".repeat(90)), `${"x".repeat(77)}...`);
});

test("note color helpers normalize text and border colors", () => {
  assert.equal(noteTextColorForItem({ color: "#ffffff", textColor: "#123456" }), "#123456");
  assert.equal(noteTextColorForItem({ color: "#ffffff", textColor: "" }), "#1d2732");
  assert.equal(noteBorderColor("#111111"), "#333333");
});

test("note size derives natural size and clamps manual dimensions", () => {
  assert.deepEqual(noteSizeForItem({
    notes: "short",
    title: "",
    color: "#ef4444",
    textColor: "",
  }, sizeOptions), { width: 196, height: 50 });

  assert.deepEqual(noteSizeForItem({
    notes: "longer text that should grow width",
    title: "",
    color: "#ef4444",
    textColor: "",
  }, sizeOptions), { width: 290, height: 50 });

  assert.deepEqual(noteSizeForItem({
    notes: "manual",
    title: "",
    color: "#ef4444",
    textColor: "",
    noteWidth: 20,
    noteHeight: 999,
  }, sizeOptions), { width: 84, height: 280 });
});

test("finite number helper accepts numeric strings and rejects invalid values", () => {
  assert.equal(hasFiniteNumber("12.5"), true);
  assert.equal(hasFiniteNumber("not-a-number"), false);
});
