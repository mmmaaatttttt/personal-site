import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import {
  completerResponseRate,
  observedRateLatex,
  trueRateLatex,
} from "./utils";

describe("completerResponseRate", () => {
  it("matches the true rate when completion is identical for both groups", () => {
    const rate = completerResponseRate(0.5, 0.8, 0.8);
    expect(rate).toBeCloseTo(0.5, 10);
  });

  it("inflates the completer rate above the true rate when non-responders complete less", () => {
    const rate = completerResponseRate(0.5, 0.9, 0.5);
    expect(rate).toBeGreaterThan(0.5);
  });

  it("deflates the completer rate below the true rate when responders complete less", () => {
    const rate = completerResponseRate(0.5, 0.5, 0.9);
    expect(rate).toBeLessThan(0.5);
  });

  it("matches the worked example: a coin-flip trial reporting as a clear win", () => {
    const rate = completerResponseRate(0.5, 0.9, 0.5);
    expect(rate).toBeCloseTo(0.642857, 5);
  });

  it("stays well-defined at the true-rate boundaries", () => {
    expect(completerResponseRate(0, 0.8, 0.4)).toBeCloseTo(0, 10);
    expect(completerResponseRate(1, 0.8, 0.4)).toBeCloseTo(1, 10);
  });

  it("always returns a value in [0, 1]", () => {
    const rate = completerResponseRate(0.3, 0.95, 0.15);
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(1);
  });

  it("returns NaN when neither group completes at all, rather than inventing a value", () => {
    expect(completerResponseRate(0.5, 0, 0)).toBeNaN();
    expect(completerResponseRate(0.3, 0, 0)).toBeNaN();
  });
});

describe("trueRateLatex", () => {
  it("colors the true rate as a percentage to match its slider", () => {
    const str = trueRateLatex(0.5);
    expect(str).toContain(`\\textcolor{${COLORS.PURPLE}}{50\\%}`);
  });

  it("reserves a fixed-width, centered slot for the value regardless of digit count", () => {
    const oneDigit = trueRateLatex(0.05);
    const threeDigit = trueRateLatex(1);
    const expectedWrap = (inner: string) =>
      `\\hphantom{10}\\mathclap{${inner}}\\hphantom{0\\%}`;
    expect(oneDigit).toContain(
      expectedWrap(`\\textcolor{${COLORS.PURPLE}}{5\\%}`),
    );
    expect(threeDigit).toContain(
      expectedWrap(`\\textcolor{${COLORS.PURPLE}}{100\\%}`),
    );
  });
});

describe("observedRateLatex", () => {
  it("starts with the fraction, since the label now renders separately above it", () => {
    const str = observedRateLatex(0.5, 0.9, 0.5);
    expect(str.startsWith("\\frac")).toBe(true);
  });

  it("colors each term as a percentage to match its slider", () => {
    const str = observedRateLatex(0.5, 0.9, 0.5);
    expect(str).toContain(`\\textcolor{${COLORS.PURPLE}}{50\\%}`);
    expect(str).toContain(`\\textcolor{${COLORS.DARK_GREEN}}{90\\%}`);
    expect(str).toContain(`\\textcolor{${COLORS.RED}}{50\\%}`);
  });

  it("reserves a fixed-width, centered slot for every term in the formula, not just the result", () => {
    const str = observedRateLatex(0.5, 0.9, 0.5);
    const occurrences = str.split("\\mathclap{").length - 1;
    expect(occurrences).toBe(7); // r, cR twice each; oneMinusR, cN, result once
  });

  it("multiplies terms with an explicit times symbol now that parentheses are gone", () => {
    const str = observedRateLatex(0.5, 0.9, 0.5);
    expect(str).toContain("\\times");
  });

  it("computes and appends the completer response rate as a percentage", () => {
    const str = observedRateLatex(0.5, 0.9, 0.5);
    expect(str).toContain("\\mathclap{64\\%}");
  });

  it("dashes out the result instead of showing a percentage when neither group completes", () => {
    const str = observedRateLatex(0.5, 0, 0);
    expect(str).toContain("\\mathclap{\\text{---}}");
    expect(str).toContain(`\\textcolor{${COLORS.PURPLE}}{50\\%}`);
    expect(str).toContain(`\\textcolor{${COLORS.DARK_GREEN}}{0\\%}`);
  });
});
