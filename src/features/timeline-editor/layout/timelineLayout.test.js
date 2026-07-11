import assert from "node:assert/strict";
import test from "node:test";

import {
  axisDetailForZoom,
  axisDayLabelInterval,
  centralTimelineGeometry,
  defaultEndDateForSnap,
  fitZoomForTimeline,
  laneCenterY,
  laneDisplayLabel,
  laneSourceMapForVisualMove,
  laneSide,
  laneTrackNumber,
  laneVisualOrder,
  minDurationDaysForSnap,
  snapTimelineDate,
  timelineDateToX,
  timelinePixelsPerDay,
  timelineRenderBounds,
  timelineWheelAction,
  timelineXToDate,
} from "./timelineLayout.ts";

test("timeline coordinate helpers convert dates to x positions and back", () => {
  const pixelsPerDay = timelinePixelsPerDay(30, 30);

  assert.equal(pixelsPerDay, 1);
  assert.equal(timelineDateToX("2026-01-11", "2026-01-01", 132, pixelsPerDay), 142);
  assert.equal(timelineXToDate(142, "2026-01-01", 132, pixelsPerDay), "2026-01-11");
});

test("timeline fit zoom respects gutters and configured zoom limits", () => {
  assert.equal(Number(fitZoomForTimeline({
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    viewportWidth: 1242,
    leftGutter: 132,
    rightGutter: 110,
    minZoom: 6,
    maxZoom: 360,
  }).toFixed(2)), 75.08);
});

test("timeline fit zoom clamps to the configured zoom range", () => {
  assert.equal(fitZoomForTimeline({
    startDate: "2026-01-01",
    endDate: "2026-01-02",
    viewportWidth: 3000,
    leftGutter: 132,
    rightGutter: 110,
    minZoom: 6,
    maxZoom: 360,
  }), 360);
});

test("timeline snap helper snaps by year month week and day", () => {
  assert.equal(snapTimelineDate("2026-06-15", "2026-01-01", "year"), "2026-01-01");
  assert.equal(snapTimelineDate("2026-07-02", "2026-01-01", "year"), "2027-01-01");
  assert.equal(snapTimelineDate("2026-03-15", "2026-01-01", "month"), "2026-03-01");
  assert.equal(snapTimelineDate("2026-03-16", "2026-01-01", "month"), "2026-04-01");
  assert.equal(snapTimelineDate("2026-01-10", "2026-01-01", "week"), "2026-01-08");
  assert.equal(snapTimelineDate("2026-01-10", "2026-01-01", "day"), "2026-01-10");
});

test("timeline duration helpers derive minimum and default end dates from snap", () => {
  assert.equal(minDurationDaysForSnap("year"), 365);
  assert.equal(minDurationDaysForSnap("month"), 28);
  assert.equal(minDurationDaysForSnap("week"), 7);
  assert.equal(minDurationDaysForSnap("day"), 1);
  assert.equal(defaultEndDateForSnap("2026-01-01", "year"), "2027-01-01");
  assert.equal(defaultEndDateForSnap("2026-01-01", "week"), "2026-01-08");
  assert.equal(defaultEndDateForSnap("2026-01-01", "day"), "2026-01-02");
  assert.equal(defaultEndDateForSnap("2026-01-01", "month"), "2026-02-01");
});

test("central timeline geometry places lanes around the axis", () => {
  const geometry = centralTimelineGeometry({
    laneCount: 5,
    rowHeight: 68,
    axisHeight: 88,
    topPadding: 24,
    footerHeight: 34,
  });

  assert.equal(geometry.axisY, 272);
  assert.equal(geometry.axisBandTop, 228);
  assert.equal(geometry.trackTop, 24);
  assert.equal(geometry.trackBottom, 452);
  assert.equal(geometry.contentHeightWithoutNotes, 486);
  assert.equal(laneCenterY(0, geometry, 68), 194);
  assert.equal(laneCenterY(1, geometry, 68), 350);
  assert.equal(laneCenterY(4, geometry, 68), 58);
});

test("central timeline lanes keep stored labels independent of axis position", () => {
  assert.equal(laneSide(0), "above");
  assert.equal(laneSide(1), "below");
  assert.equal(laneSide(2), "above");
  assert.equal(laneTrackNumber(0), 1);
  assert.equal(laneTrackNumber(1), 1);
  assert.equal(laneTrackNumber(4), 3);
  assert.equal(laneDisplayLabel(0), "Line 1");
  assert.equal(laneDisplayLabel(1), "Line 2");
  assert.equal(laneDisplayLabel(4), "Line 5");
  assert.equal(laneDisplayLabel(2, "Education"), "Education");
  assert.equal(laneDisplayLabel(2, "Line 3"), "Line 3");
  assert.equal(laneDisplayLabel(1, "Line +1"), "Line 1");
});

test("timeline render bounds center short content in the visible viewport", () => {
  assert.deepEqual(timelineRenderBounds(10, 510, 800), {
    top: -140,
    bottom: 660,
    height: 800,
  });
  assert.deepEqual(timelineRenderBounds(-20, 880, 700), {
    top: -20,
    bottom: 880,
    height: 900,
  });
});

test("timeline render bounds keep manual viewport space symmetric while preserving directional content", () => {
  assert.deepEqual(timelineRenderBounds(0, 560, 900), {
    top: -170,
    bottom: 730,
    height: 900,
  });
  assert.deepEqual(timelineRenderBounds(0, 560, 700), {
    top: -70,
    bottom: 630,
    height: 700,
  });
  assert.deepEqual(timelineRenderBounds(-120, 560, 800), {
    top: -180,
    bottom: 620,
    height: 800,
  });
});

test("central timeline visual order keeps below-axis swaps below the axis", () => {
  assert.deepEqual(laneVisualOrder(5), [4, 2, 0, 1, 3]);
  assert.deepEqual(laneSourceMapForVisualMove(5, 3, 1), [0, 3, 2, 1, 4]);
  assert.deepEqual(laneSourceMapForVisualMove(5, 4, 2), [0, 1, 4, 3, 2]);
  assert.deepEqual(laneSourceMapForVisualMove(5, 1, 0), [1, 0, 2, 3, 4]);
});

test("timeline wheel actions route vertical spacing and area shortcuts", () => {
  assert.equal(timelineWheelAction({}), "none");
  assert.equal(timelineWheelAction({ altKey: true }), "none");
  assert.equal(timelineWheelAction({ ctrlKey: true }), "horizontal-zoom");
  assert.equal(timelineWheelAction({ metaKey: true }), "horizontal-zoom");
  assert.equal(timelineWheelAction({ ctrlKey: true, shiftKey: true }), "row-height");
  assert.equal(timelineWheelAction({ metaKey: true, shiftKey: true }), "row-height");
  assert.equal(timelineWheelAction({ altKey: true, ctrlKey: true }), "timeline-area");
  assert.equal(timelineWheelAction({ altKey: true, metaKey: true }), "timeline-area");
  assert.equal(timelineWheelAction({
    getModifierState: (key) => key === "Control",
  }), "horizontal-zoom");
  assert.equal(timelineWheelAction({
    getModifierState: (key) => key === "Shift" || key === "Meta",
  }), "row-height");
  assert.equal(timelineWheelAction({
    getModifierState: (key) => key === "Alt" || key === "Meta",
  }), "timeline-area");
});

test("axis detail helper suppresses clutter when units are too narrow", () => {
  assert.deepEqual(axisDetailForZoom(18), {
    monthBands: false,
    monthGrid: false,
    dayGrid: false,
    dayTicks: false,
    dayLabels: false,
  });
  assert.deepEqual(axisDetailForZoom(60), {
    monthBands: false,
    monthGrid: true,
    dayGrid: false,
    dayTicks: false,
    dayLabels: false,
  });
  assert.deepEqual(axisDetailForZoom(92), {
    monthBands: true,
    monthGrid: true,
    dayGrid: false,
    dayTicks: false,
    dayLabels: false,
  });
  assert.deepEqual(axisDetailForZoom(320), {
    monthBands: true,
    monthGrid: true,
    dayGrid: true,
    dayTicks: true,
    dayLabels: true,
  });
});

test("axis day label interval avoids dense labels on long timelines", () => {
  assert.equal(axisDayLabelInterval(365, 320), 1);
  assert.equal(axisDayLabelInterval(1200, 320), 5);
  assert.equal(axisDayLabelInterval(2400, 320), 10);
  assert.equal(axisDayLabelInterval(5000, 320), 0);
  assert.equal(axisDayLabelInterval(365, 120), 5);
});
