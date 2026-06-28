import assert from "node:assert/strict";
import test from "node:test";

import {
  rangesOverlap,
  snapEdgeOffset,
  snapMoveDelta,
} from "./edgeSnap.ts";

const neighbors = [
  { id: "a", hasRange: true, start: 100, end: 140 },
  { id: "b", hasRange: true, start: 180, end: 220 },
];

test("snap edge offset moves an edge to the nearest neighboring edge inside the threshold", () => {
  assert.equal(snapEdgeOffset(97, neighbors, 4), 100);
  assert.equal(snapEdgeOffset(143, neighbors, 4), 140);
});

test("snap edge offset leaves an edge unchanged outside the threshold", () => {
  assert.equal(snapEdgeOffset(94, neighbors, 4), 94);
});

test("snap move delta aligns the moved range edge to the nearest neighboring edge", () => {
  assert.equal(snapMoveDelta(82, 97, neighbors, 4), 3);
  assert.equal(snapMoveDelta(143, 158, neighbors, 4), -3);
});

test("range overlap treats touching edges as non-overlapping", () => {
  assert.equal(rangesOverlap(0, 10, 10, 20), false);
  assert.equal(rangesOverlap(0, 11, 10, 20), true);
});
