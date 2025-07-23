import Pattern from "./pattern";

describe("Pattern class", () => {
  it("should instance a new Pattern 10010", () => {
    const pattern = new Pattern("10010");
    expect(pattern.pulses).toBe("10010");
  });

  it("should instance a new euclidean pattern 4,4", () => {
    const pattern = new Pattern(4, 4);
    expect(pattern.pulses).toBe("1111");
  });
});

describe("Shift pattern", () => {
  const pattern = new Pattern("1110");

  it("should shift the pattern in 1 step", () => {
    expect(pattern.shift(1).pulses).toBe("0111");
  });

  it("should shift the pattern in 2 step", () => {
    expect(pattern.shift(2).pulses).toBe("1011");
  });

  it("should shift the pattern in 3 step", () => {
    expect(pattern.shift(3).pulses).toBe("1101");
  });

  it("should shift the pattern in 2 step", () => {
    expect(pattern.shift(2).pulses).toBe("1011");
  });

  // it("should shift the pattern in 4 step", () => {
  //   expect(pattern.shift(1).pulses).toBe("00101");
  // });p
});
