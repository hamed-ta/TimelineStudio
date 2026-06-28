import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_ITEM_COLOR,
  adjustColor,
  hexToHsv,
  hexToRgb,
  hsvToHex,
  normalizeColor,
  normalizeOptionalColor,
  parseHexColor,
  readableTextColor,
  rgbToHex,
} from "./colors.ts";

test("parse hex color accepts hash and bare six-digit values", () => {
  assert.equal(parseHexColor("#ABCDEF"), "#abcdef");
  assert.equal(parseHexColor("ABCDEF"), "#abcdef");
  assert.equal(parseHexColor("not-a-color"), null);
});

test("normalize color falls back to the default palette color", () => {
  assert.equal(DEFAULT_ITEM_COLOR, "#3b82f6");
  assert.equal(normalizeColor("bad"), DEFAULT_ITEM_COLOR);
  assert.equal(normalizeOptionalColor("bad"), "");
});

test("readable text color chooses dark text for light colors and white for dark colors", () => {
  assert.equal(readableTextColor("#ffffff"), "#1d2732");
  assert.equal(readableTextColor("#111827"), "#ffffff");
});

test("adjust color applies channel offsets with clamping", () => {
  assert.equal(adjustColor("#001122", 20), "#142536");
  assert.equal(adjustColor("#fffefe", 10), "#ffffff");
  assert.equal(adjustColor("#050505", -10), "#000000");
});

test("rgb helpers parse and clamp channel values", () => {
  assert.deepEqual(hexToRgb("#0ea5e9"), { red: 14, green: 165, blue: 233 });
  assert.equal(rgbToHex(14.4, 300, -2), "#0eff00");
});

test("hsv helpers convert between hex and hsv", () => {
  assert.deepEqual(hexToHsv("#ff0000"), { h: 0, s: 100, v: 100 });
  assert.equal(hsvToHex(200, 75, 80), "#3399cc");
  assert.equal(hsvToHex(-160, 75, 80), "#3399cc");
});
