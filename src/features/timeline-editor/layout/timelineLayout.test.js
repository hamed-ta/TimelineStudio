import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultEndDateForSnap,
  fitZoomForTimeline,
  minDurationDaysForSnap,
  snapTimelineDate,
  timelineDateToX,
  timelinePixelsPerDay,
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
