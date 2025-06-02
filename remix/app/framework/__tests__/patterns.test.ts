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
  it("should not rotate when offset is 0", () => {
    const pattern = createPattern("111010");
    const [rotated] = shiftPattern(pattern, 0);
    expect(rotated).toEqual([1, 1, 1, 0, 1, 0]);
  });

  it("should shift pattern left by 2 positions", () => {
    const pattern = createPattern("111010");
    const [rotated] = shiftPattern(pattern, 2);
    expect(rotated).toEqual([1, 0, 1, 0, 1, 1]);
  });

  it("should handle offset larger than pattern length by using modulo", () => {
    const pattern = createPattern("111010");
    const [rotated] = shiftPattern(pattern, 8); // 8 % 6 = 2
    expect(rotated).toEqual([1, 0, 1, 0, 1, 1]); // Same as shift by 2
  });

  it("should return original pattern when offset equals pattern length", () => {
    const pattern = createPattern("111010");
    const [rotated] = shiftPattern(pattern, 6);
    expect(rotated).toEqual([1, 1, 1, 0, 1, 0]);
  });
});
