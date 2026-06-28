import assert from "node:assert/strict";
import test from "node:test";

import {
  periodDerivedMeta,
} from "./periodItem.ts";

const period = {
  type: "period",
  startDate: "1987-07-13",
  endDate: "1990-08-20",
  showAgeLabels: true,
  showDurationLabel: true,
};

test("period derived meta includes age and duration labels when there is room", () => {
  assert.deepEqual(periodDerivedMeta(period, 260, "1987-07-13"), {
    startAge: "Age 0d",
    endAge: "Age 3y 1m 7d",
    duration: "3y 1m 7d",
  });
});

test("period derived meta hides labels below width thresholds", () => {
  assert.deepEqual(periodDerivedMeta(period, 180, "1987-07-13"), {
    startAge: "",
    endAge: "",
    duration: "3y 1m 7d",
  });
  assert.equal(periodDerivedMeta(period, 120, "1987-07-13"), null);
});

test("period derived meta respects disabled age and duration settings", () => {
  assert.equal(periodDerivedMeta({
    ...period,
    showAgeLabels: false,
    showDurationLabel: false,
  }, 260, "1987-07-13"), null);
});

test("period derived meta ignores non-period items and missing birth dates", () => {
  assert.equal(periodDerivedMeta({ ...period, type: "event" }, 260, "1987-07-13"), null);
  assert.deepEqual(periodDerivedMeta(period, 260, null), {
    startAge: "",
    endAge: "",
    duration: "3y 1m 7d",
  });
});
