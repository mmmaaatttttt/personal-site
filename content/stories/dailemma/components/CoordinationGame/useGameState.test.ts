import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import { payoffColor, useGameState } from "./useGameState";

describe("useGameState", () => {
  it("marks automation as dominant and not a dilemma when savings exceed demand loss", () => {
    const state = useGameState(10, 4);
    expect(state.isNE(0, 0)).toBe(true);
    expect(state.isNE(1, 1)).toBe(false);
    expect(state.isParetoOptimal(1, 1)).toBe(false);
    expect(state.gameLabel).toContain("No dilemma");
  });

  it("identifies a prisoner's dilemma when automation is dominant but mutually harmful", () => {
    const state = useGameState(6, 10);
    expect(state.isNE(0, 0)).toBe(true);
    expect(state.isParetoOptimal(1, 1)).toBe(true);
    expect(state.gameLabel).toContain("Prisoner's Dilemma");
  });

  it("marks restraint as dominant when automation isn't individually rational", () => {
    const state = useGameState(1, 10);
    expect(state.isNE(1, 1)).toBe(true);
    expect(state.isNE(0, 0)).toBe(false);
    expect(state.isParetoOptimal(1, 1)).toBe(false);
    expect(state.gameLabel).toContain("Restraint is dominant");
  });

  it("builds the payoff matrix from pdPayoffs", () => {
    const state = useGameState(10, 4);
    expect(state.cells[0][0].a).toBe(6);
    expect(state.cells[0][0].b).toBe(6);
    expect(state.cells[1][1].a).toBe(0);
    expect(state.cells[1][1].b).toBe(0);
  });
});

describe("payoffColor", () => {
  it("returns green for a clearly positive payoff", () => {
    expect(payoffColor(1)).toBe(COLORS.DARK_GREEN);
  });

  it("returns red for a clearly negative payoff", () => {
    expect(payoffColor(-1)).toBe(COLORS.RED);
  });

  it("returns gray for a payoff near zero", () => {
    expect(payoffColor(0.001)).toBe(COLORS.DARK_GRAY);
  });
});
