import assert from "node:assert/strict";
import test from "node:test";

import {
  clampMovedRange,
  preventMovedRangeOverlap,
  preventResizedEndOverlap,
  preventResizedStartOverlap,
} from "./dragRange.ts";

const rangeNeighbor = { id: "a", start: 10, end: 20, hasRange: true };
const pointNeighbor = { id: "b", start: 30, end: 30, hasRange: false };

test("resized start overlap moves the start after a blocking range", () => {
  assert.equal(preventResizedStartOverlap(5, 24, [rangeNeighbor, pointNeighbor], 3), 20);
});

test("resized end overlap moves the end before a blocking range", () => {
  assert.equal(preventResizedEndOverlap(5, 24, [rangeNeighbor, pointNeighbor], 3), 10);
});

test("moved point ranges clamp to the allowed point range", () => {
  assert.deepEqual(clampMovedRange({
    start: -4,
    end: -4,
    duration: 0,
    hasRange: false,
    minOffset: 0,
    maxRangeEnd: 40,
    maxPoint: 30,
  }), [0, 0]);
});

test("moved ranges clamp left and right while preserving duration", () => {
  assert.deepEqual(clampMovedRange({
    start: -4,
    end: 6,
    duration: 10,
    hasRange: true,
    minOffset: 0,
    maxRangeEnd: 40,
    maxPoint: 30,
  }), [0, 10]);
  assert.deepEqual(clampMovedRange({
    start: 35,
    end: 45,
    duration: 10,
    hasRange: true,
    minOffset: 0,
    maxRangeEnd: 40,
    maxPoint: 30,
  }), [30, 40]);
});

test("moved range overlap pushes moving ranges away from blockers", () => {
  assert.deepEqual(preventMovedRangeOverlap({
    start: 12,
    end: 22,
    duration: 10,
    neighbors: [rangeNeighbor],
    originalStart: 0,
    minOffset: 0,
    maxRangeEnd: 40,
  }), [0, 10]);

  assert.deepEqual(preventMovedRangeOverlap({
    start: 8,
    end: 18,
    duration: 10,
    neighbors: [rangeNeighbor],
    originalStart: 30,
    minOffset: 0,
    maxRangeEnd: 40,
  }), [20, 30]);
});
