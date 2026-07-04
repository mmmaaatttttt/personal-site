import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import { cooperativeFormulaLatex, nashFormulaLatex } from "./formatFormula";

describe("nashFormulaLatex", () => {
  it("labels the rate as the free market outcome", () => {
    const str = nashFormulaLatex(0.5, 0.4, 1, 7);
    expect(str).toContain("\\text{Free market } a");
  });

  it("colors each term to match its slider", () => {
    const str = nashFormulaLatex(0.5, 0.4, 1, 7);
    expect(str).toContain(`\\textcolor{${COLORS.ORANGE}}{0.50}`);
    expect(str).toContain(`\\textcolor{${COLORS.BLUE}}{0.40}`);
    expect(str).toContain(`\\textcolor{${COLORS.DARK_GRAY}}{7}`);
    expect(str).toContain(`\\textcolor{${COLORS.PURPLE}}{1.00}`);
  });

  it("computes the Nash automation rate", () => {
    const str = nashFormulaLatex(0.5, 0.4, 1, 7);
    expect(str).toContain("= 0.44");
  });

  it("clamps the rate to 0 when savings are below the per-firm demand loss", () => {
    const str = nashFormulaLatex(0.1, 0.4, 1, 2);
    expect(str).toContain("= 0.00");
  });
});

describe("cooperativeFormulaLatex", () => {
  it("labels the rate as the coordinated outcome", () => {
    const str = cooperativeFormulaLatex(0.5, 0.4, 1);
    expect(str).toContain("\\text{Coordinated } a");
  });

  it("colors each term to match its slider", () => {
    const str = cooperativeFormulaLatex(0.5, 0.4, 1);
    expect(str).toContain(`\\textcolor{${COLORS.ORANGE}}{0.50}`);
    expect(str).toContain(`\\textcolor{${COLORS.BLUE}}{0.40}`);
    expect(str).toContain(`\\textcolor{${COLORS.PURPLE}}{1.00}`);
  });

  it("computes the cooperative automation rate", () => {
    const str = cooperativeFormulaLatex(0.5, 0.4, 1);
    expect(str).toContain("= 0.10");
  });

  it("clamps the rate to 0 when savings do not exceed the demand loss", () => {
    const str = cooperativeFormulaLatex(0.3, 0.4, 1);
    expect(str).toContain("= 0.00");
  });
});
