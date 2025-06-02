import { getPattern } from "./euclidean-rhythms";

function createPattern(pulse: string): (0 | 1)[];
function createPattern(pulse: number, steps: number): (0 | 1)[];
function createPattern(pulses: unknown, steps?: unknown) {
  if (typeof pulses === "number" && steps) {
    if ((steps as number) < pulses) {
      throw new Error("Pulses are bigger then steps");
    }
    return getPattern(pulses, steps as number);
  } else if (typeof pulses === "string") {
    steps = pulses.length;
    return pulses.split("").map(Number);
  }
}

function shiftPattern(pattern: (0 | 1)[], offset: number) {
  const isIncreasing = 0 < offset ? true : false;

  if (isIncreasing) {
    const tail = pattern.splice(pattern.length - 1, 1);

    for (let i = 0; i < tail.length; i++) {
      pattern.unshift(tail[i]);
    }
  } else {
    const head = pattern.splice(0, 1);
    for (let i = 0; i < head.length; i++) {
      pattern.push(head[i]);
    }
  }

  return [pattern, offset];
}

export { createPattern, shiftPattern };
