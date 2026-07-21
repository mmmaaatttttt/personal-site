import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { evaluateActions } from "../../bonusMath";
import { type SlotResult, SlotValue } from "../../data";
import QuestionBoard from "./QuestionBoard";

const scenario: SlotResult = [
  SlotValue.CROWN,
  SlotValue.CROWN,
  SlotValue.CROWN,
  SlotValue.DASH,
];

describe("QuestionBoard", () => {
  it("renders one reel button per slot", () => {
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={null}
        disabled={false}
        onSelectSlot={vi.fn()}
        actionValues={null}
        optimalAction={null}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("calls onSelectSlot with the clicked slot's index", () => {
    const onSelectSlot = vi.fn();
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={null}
        disabled={false}
        onSelectSlot={onSelectSlot}
        actionValues={null}
        optimalAction={null}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[3]);
    expect(onSelectSlot).toHaveBeenCalledWith(3);
  });

  it("highlights only the exact slot clicked, even when other slots share its symbol", () => {
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={0}
        disabled={false}
        onSelectSlot={vi.fn()}
        actionValues={null}
        optimalAction={null}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    // slots 1 and 2 are also CROWN but were not the one clicked
    expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
    expect(buttons[2]).toHaveAttribute("aria-pressed", "false");
    expect(buttons[3]).toHaveAttribute("aria-pressed", "false");
  });

  it("disables every slot when disabled is true", () => {
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={null}
        disabled={true}
        onSelectSlot={vi.fn()}
        actionValues={null}
        optimalAction={null}
      />,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("shows no EV pills when actionValues is not provided", () => {
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={null}
        disabled={false}
        onSelectSlot={vi.fn()}
        actionValues={null}
        optimalAction={null}
      />,
    );

    expect(screen.queryAllByText(/^-?\d+\.\d{3}$/)).toHaveLength(0);
  });

  it("shows a green pill on the optimal symbol's slots and a red pill on a wrong selection", () => {
    const actionValues = evaluateActions(scenario, 1);
    render(
      <QuestionBoard
        scenario={scenario}
        selectedIndex={0}
        disabled={true}
        onSelectSlot={vi.fn()}
        actionValues={actionValues}
        optimalAction={SlotValue.DASH}
      />,
    );

    const pills = screen.getAllByText(/^-?\d+\.\d{3}$/);
    expect(pills).toHaveLength(4);
    // slot 3 (DASH) is optimal
    expect(pills[3]).toHaveClass("bg-green-100");
    // slot 0 (CROWN) was selected but isn't optimal
    expect(pills[0]).toHaveClass("bg-red-100");
    // slots sharing the non-optimal CROWN symbol but not selected stay neutral
    expect(pills[1]).toHaveClass("bg-white");
  });
});
