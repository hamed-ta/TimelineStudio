import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAgeAtDate,
  formatCompactDateSpan,
  formatDetailedAgeAtDate,
  formatDetailedAgeValueAtDate,
  formatDetailedDateSpan,
  getDateSpanParts,
} from "./dateSpans.ts";

test("date span parts borrow days and months across calendar boundaries", () => {
  assert.deepEqual(getDateSpanParts("1987-07-13", "1990-08-20"), {
    years: 3,
    months: 1,
    days: 7,
  });
});

test("compact date span includes years months and days when present", () => {
  assert.equal(formatCompactDateSpan("1987-07-13", "1990-08-20"), "3y 1m 7d");
});

test("compact date span keeps zero-duration spans readable", () => {
  assert.equal(formatCompactDateSpan("2026-01-01", "2026-01-01"), "0d");
});

test("detailed date span pluralizes units and omits zero units", () => {
  assert.equal(formatDetailedDateSpan("2026-01-01", "2027-02-02"), "1 year, 1 month, 1 day");
});

test("date span formatters report reversed ranges as before", () => {
  assert.equal(formatCompactDateSpan("2026-02-01", "2026-01-01"), "before");
  assert.equal(formatDetailedDateSpan("2026-02-01", "2026-01-01"), "before");
});

test("age helpers format dates relative to the birth date", () => {
  assert.equal(formatAgeAtDate("1987-07-13", "1990-08-20"), "Age 3y 1m 7d");
  assert.equal(formatDetailedAgeAtDate("1987-07-13", "1990-08-20"), "Age 3 years, 1 month, 7 days");
  assert.equal(formatDetailedAgeValueAtDate("1987-07-13", "1990-08-20"), "3 years, 1 month, 7 days");
});

test("age helpers preserve before-birth labels", () => {
  assert.equal(formatAgeAtDate("1987-07-13", "1987-07-12"), "Before birth");
  assert.equal(formatDetailedAgeAtDate("1987-07-13", "1987-07-12"), "Before birth");
  assert.equal(formatDetailedAgeValueAtDate("1987-07-13", "1987-07-12"), "before birth");
});
