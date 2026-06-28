import assert from "node:assert/strict";
import test from "node:test";

import {
  canPlaceAxisLabel,
} from "./axisLayout.ts";

test("axis label placement allows labels after the previous label plus gap", () => {
  assert.equal(canPlaceAxisLabel({ centerX: 60, width: 20, lastLabelEnd: 35, gap: 10 }), true);
});

test("axis label placement blocks labels that would collide with the previous label gap", () => {
  assert.equal(canPlaceAxisLabel({ centerX: 59, width: 20, lastLabelEnd: 40, gap: 10 }), false);
});

test("axis label placement treats touching the required gap as valid", () => {
  assert.equal(canPlaceAxisLabel({ centerX: 50, width: 20, lastLabelEnd: 30, gap: 10 }), true);
});
