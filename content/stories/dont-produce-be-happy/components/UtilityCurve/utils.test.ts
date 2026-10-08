import { describe, expect, it } from "vitest";
import { regressionEquationLatex } from "./utils";

describe("regressionEquationLatex", () => {
  it("formats the intercept, slope, and R^2 to two decimal places", () => {
    expect(regressionEquationLatex(0.0815, 0.6189, 0.6765)).toBe(
      "y = 0.08 + 0.62\\ln(x), \\quad R^2 = 0.68",
    );
  });

  it("includes the minus sign for a negative intercept", () => {
    expect(regressionEquationLatex(-0.3673, 0.6597, 0.6603)).toBe(
      "y = -0.37 + 0.66\\ln(x), \\quad R^2 = 0.66",
    );
  });
});
