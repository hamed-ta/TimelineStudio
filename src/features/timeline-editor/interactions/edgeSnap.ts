export type EdgeSnapNeighbor = {
  id?: string;
  hasRange: boolean;
  start: number;
  end: number;
};

export function snapEdgeOffset(edge: number, neighbors: EdgeSnapNeighbor[], threshold: number): number {
  let bestDelta = 0;
  let bestDistance = threshold + 1;
  neighbors.forEach((neighbor) => {
    [neighbor.start, neighbor.end].forEach((target) => {
      const distance = Math.abs(edge - target);
      if (distance <= threshold && distance < bestDistance) {
        bestDistance = distance;
        bestDelta = target - edge;
      }
    });
  });
  return edge + bestDelta;
}

export function snapMoveDelta(
  start: number,
  end: number,
  neighbors: EdgeSnapNeighbor[],
  threshold: number,
): number {
  let bestDelta = 0;
  let bestDistance = threshold + 1;
  neighbors.forEach((neighbor) => {
    [neighbor.start, neighbor.end].forEach((target) => {
      [target - start, target - end].forEach((delta) => {
        const distance = Math.abs(delta);
        if (distance <= threshold && distance < bestDistance) {
          bestDistance = distance;
          bestDelta = delta;
        }
      });
    });
  });
  return bestDelta;
}

export function rangesOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && endA > startB;
}
