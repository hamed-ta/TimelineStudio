import assert from "node:assert/strict";
import test from "node:test";

import {
  findAvailableNoteY,
  noteBubblePath,
  noteRectsOverlap,
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
