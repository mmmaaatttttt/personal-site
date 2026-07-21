import { describe, expect, it } from "vitest";
import type { ActionValues } from "../../bonusMath";
import { type SlotResult, SlotValue } from "../../data";
import { distinctSymbols, valueForAction } from "./quizMath";

describe("distinctSymbols", () => {
  it("returns each unique symbol once", () => {
    const scenario: SlotResult = [
      SlotValue.COIN_1,
      SlotValue.COIN_1,
      SlotValue.DASH,
      SlotValue.DASH,
    ];

    expect(distinctSymbols(scenario)).toEqual([
      SlotValue.COIN_1,
      SlotValue.DASH,
    ]);
  });
});

describe("valueForAction", () => {
  const actionValues: ActionValues = {
    stay: 4.2,
    spin: { [SlotValue.DASH]: 9.1 },
  };

  it("returns the stay value for the 'stay' action", () => {
    expect(valueForAction("stay", actionValues)).toBe(4.2);
  });

  it("returns the spin value for a symbol present in the action values", () => {
    expect(valueForAction(SlotValue.DASH, actionValues)).toBe(9.1);
  });

  it("falls back to 0 for a symbol with no computed spin value", () => {
    expect(valueForAction(SlotValue.CROWN, actionValues)).toBe(0);
  });
});
