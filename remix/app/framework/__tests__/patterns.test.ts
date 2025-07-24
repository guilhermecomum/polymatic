import { expect, it, describe } from "vitest";
import { createPattern, shiftPattern } from "../patterns";

describe("createPattern", () => {
  it("should return pattern when input is array", () => {
    const pattern = createPattern("101010");
    expect(pattern).toEqual([1, 0, 1, 0, 1, 0]);
  });

  it("should return pattern when input is 2,3 ", () => {
    const pattern = createPattern(2, 3);
    expect(pattern).toEqual([1, 0, 1]);
  });
});

describe("shiftPattern", () => {
  it("should rotate when direction is clockwise", () => {
    const pattern = createPattern("111010");
    const rotated = shiftPattern(pattern, true);
    expect(rotated).toEqual([0, 1, 1, 1, 0, 1]);
  });

  it("should rotate counterclockwise when clockwise is false", () => {
    const pattern = createPattern("111010");
    const rotated = shiftPattern(pattern, false);
    expect(rotated).toEqual([1, 1, 0, 1, 0, 1]);
  });
});
