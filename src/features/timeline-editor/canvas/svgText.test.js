import assert from "node:assert/strict";
import test from "node:test";

import {
  estimateSvgTextWidth,
  fitSvgText,
  safeSvgId,
} from "./svgText.ts";

test("svg text estimation uses a configurable character width", () => {
  assert.equal(estimateSvgTextWidth("abcd", 7), 28);
});

test("svg text fitting keeps short labels and truncates long labels", () => {
  assert.equal(fitSvgText("Short", 100, 7), "Short");
  assert.equal(fitSvgText("Longer label", 42, 7), "Lon...");
  assert.equal(fitSvgText("Hidden", 0, 7), "");
});

test("safe svg ids replace characters that cannot be used in generated ids", () => {
  assert.equal(safeSvgId("item 1/#?"), "item-1---");
});

test("svg fitting preserves complete emoji and combining-character clusters", () => {
  const family = "👨‍👩‍👧‍👦";
  assert.equal(fitSvgText(family.repeat(10), 42, 7), `${family.repeat(3)}...`);
  assert.equal(fitSvgText("e\u0301".repeat(10), 42, 7), `${"e\u0301".repeat(3)}...`);
});
