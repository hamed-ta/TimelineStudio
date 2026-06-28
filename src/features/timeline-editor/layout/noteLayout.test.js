import assert from "node:assert/strict";
import test from "node:test";

import {
  fitNoteText,
  findAvailableNoteY,
  noteBubblePath,
  noteTextFirstBaseline,
  noteRectsOverlap,
  textDirectionFor,
  wrapNoteText,
  wrapNoteTextLines,
} from "./noteLayout.ts";

test("note rect overlap uses a gap around both rectangles", () => {
  const first = { x: 10, y: 20, width: 100, height: 40 };
  const nearby = { x: 115, y: 20, width: 100, height: 40 };
  const distant = { x: 122, y: 20, width: 100, height: 40 };

  assert.equal(noteRectsOverlap(first, nearby, 10), true);
  assert.equal(noteRectsOverlap(first, distant, 10), false);
});

test("note rect overlap treats touching edges outside the gap as non-overlapping", () => {
  const first = { x: 0, y: 0, width: 100, height: 40 };
  const touching = { x: 100, y: 0, width: 100, height: 40 };

  assert.equal(noteRectsOverlap(first, touching, 0), false);
});

test("find available note y stacks below the first blocking layout", () => {
  const rect = { x: 0, y: 0, width: 100, height: 40 };
  const placed = [
    { x: 0, y: 100, width: 100, height: 40 },
  ];

  assert.equal(findAvailableNoteY(rect, placed, 100, 10), 150);
});

test("find available note y walks multiple blockers", () => {
  const rect = { x: 0, y: 0, width: 100, height: 40 };
  const placed = [
    { x: 0, y: 100, width: 100, height: 40 },
    { x: 0, y: 150, width: 100, height: 40 },
  ];

  assert.equal(findAvailableNoteY(rect, placed, 100, 10), 200);
});

const bubbleOptions = {
  tipHeight: 7,
  tipHalfWidth: 9,
  tipMaxLean: 7,
};

test("note bubble path creates a rounded body with a centered top tip", () => {
  const path = noteBubblePath({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    tipX: 60,
    anchorX: 60,
  }, bubbleOptions);

  assert.equal(path, [
    "M 24 27",
    "H 51",
    "L 60 20",
    "L 69 27",
    "H 96",
    "Q 110 27 110 41",
    "V 56",
    "Q 110 70 96 70",
    "H 24",
    "Q 10 70 10 56",
    "V 41",
    "Q 10 27 24 27",
    "Z",
  ].join(" "));
});

test("note bubble path leans the tip base toward the anchor", () => {
  const path = noteBubblePath({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    tipX: 60,
    anchorX: 120,
  }, bubbleOptions);

  assert.match(path, /H 44 L 60 20 L 62 27/);
});

test("note bubble path clamps the tip into the rounded body", () => {
  const path = noteBubblePath({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    tipX: 0,
    anchorX: 0,
  }, bubbleOptions);

  assert.match(path, /L 33 20/);
});

const measureText = (text) => String(text || "").length * 10;
const textOptions = {
  tipHeight: 7,
  verticalPadding: 8,
  baselineOffset: 13,
  lineHeight: 17,
  measureText,
};

test("wrap note text lines by measured width", () => {
  assert.deepEqual(wrapNoteTextLines("alpha beta gamma", 100, measureText), [
    "alpha beta",
    "gamma",
  ]);
});

test("wrap note text lines splits words that are wider than the available width", () => {
  assert.deepEqual(wrapNoteTextLines("abcdef", 20, measureText), ["ab", "cd", "ef"]);
});

test("wrap note text truncates to the visible line count", () => {
  const lines = wrapNoteText("one two three four", 70, 40, textOptions);

  assert.equal(lines.length, 1);
  assert.match(lines[0], /\.\.\.$/);
});

test("fit note text keeps text within the measured width", () => {
  assert.equal(fitNoteText("abcdef", 50, measureText), "ab...");
});

test("note text direction follows the first strong text character", () => {
  assert.equal(textDirectionFor("بیماران اصفهان"), "rtl");
  assert.equal(textDirectionFor("Timeline note"), "ltr");
  assert.equal(textDirectionFor("123"), "ltr");
});

test("note text first baseline centers the visible text block in the balloon body", () => {
  const baseline = noteTextFirstBaseline({
    y: 20,
    height: 50,
    lines: ["hello"],
  }, textOptions);

  assert.equal(baseline, 53);
});
