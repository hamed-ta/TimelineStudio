import {
  type EdgeSnapNeighbor,
  rangesOverlap,
} from "./edgeSnap.ts";

export type DragRange = {
  start: number;
  end: number;
};

export type ClampMovedRangeOptions = DragRange & {
  duration: number;
  hasRange: boolean;
  minOffset: number;
  maxRangeEnd: number;
  maxPoint: number;
};

export type PreventMovedRangeOverlapOptions = DragRange & {
  duration: number;
  neighbors: EdgeSnapNeighbor[];
  originalStart: number;
  minOffset: number;
  maxRangeEnd: number;
};

export function preventResizedStartOverlap(
  start: number,
  end: number,
  neighbors: EdgeSnapNeighbor[],
  minDuration: number,
): number {
  return neighbors
    .filter((neighbor) => neighbor.hasRange)
    .reduce((nextStart, neighbor) => (
      rangesOverlap(nextStart, end, neighbor.start, neighbor.end)
        ? Math.min(end - minDuration, neighbor.end)
        : nextStart
    ), start);
}

export function preventResizedEndOverlap(
  start: number,
  end: number,
  neighbors: EdgeSnapNeighbor[],
  minDuration: number,
): number {
  return neighbors
    .filter((neighbor) => neighbor.hasRange)
    .reduce((nextEnd, neighbor) => (
      rangesOverlap(start, nextEnd, neighbor.start, neighbor.end)
        ? Math.max(start + minDuration, neighbor.start)
        : nextEnd
    ), end);
}

export function preventMovedRangeOverlap({
  start,
  end,
  duration,
  neighbors,
  originalStart,
  minOffset,
  maxRangeEnd,
}: PreventMovedRangeOverlapOptions): [number, number] {
  let nextStart = start;
  let nextEnd = end;
  const movingRight = nextStart >= originalStart;
  const blockers = neighbors.filter((neighbor) => neighbor.hasRange);

  for (let index = 0; index < blockers.length; index += 1) {
    const overlap = blockers.find((neighbor) => (
      rangesOverlap(nextStart, nextEnd, neighbor.start, neighbor.end)
    ));
    if (!overlap) break;
    if (movingRight) {
      nextEnd = overlap.start;
      nextStart = nextEnd - duration;
    } else {
      nextStart = overlap.end;
      nextEnd = nextStart + duration;
    }
    [nextStart, nextEnd] = clampMovedRange({
      start: nextStart,
      end: nextEnd,
      duration,
      hasRange: true,
      minOffset,
      maxRangeEnd,
      maxPoint: maxRangeEnd,
    });
  }

  return [nextStart, nextEnd];
}

export function clampMovedRange({
  start,
  end,
  duration,
  hasRange,
  minOffset,
  maxRangeEnd,
  maxPoint,
}: ClampMovedRangeOptions): [number, number] {
  if (!hasRange) {
    const point = clampNumber(start, minOffset, maxPoint);
    return [point, point];
  }
  let nextStart = start;
  let nextEnd = end;
  if (nextStart < minOffset) {
    nextStart = minOffset;
    nextEnd = nextStart + duration;
  }
  if (nextEnd > maxRangeEnd) {
    nextEnd = maxRangeEnd;
    nextStart = nextEnd - duration;
  }
  return [nextStart, nextEnd];
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
