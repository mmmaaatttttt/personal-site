import type { ActionValues } from "../../bonusMath";
import type { SlotResult, SlotValue } from "../../data";

export type QuizAction = "stay" | SlotValue;

export function distinctSymbols(scenario: SlotResult): SlotValue[] {
  return Array.from(new Set(scenario));
}

export function valueForAction(
  action: QuizAction,
  actionValues: ActionValues,
): number {
  if (action === "stay") return actionValues.stay;
  return actionValues.spin[action] ?? 0;
}
