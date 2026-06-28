import assert from "node:assert/strict";
import test from "node:test";

import {
  findAvailableNoteY,
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
