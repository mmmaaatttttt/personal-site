import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import type { GamingVisData } from "@/components/story/shared/GamingRelationships";
import NonlinearGamingRelationships from "./NonlinearGamingRelationships";

vi.mock("@/components/story/shared/GamingRelationships", () => ({
  default: ({
    visData,
    compact,
    step,
    max,
  }: {
    visData: GamingVisData;
    compact?: boolean;
    step?: number;
    max?: number;
  }) => (
    <div
      data-testid="gaming-relationships"
      data-compact={String(compact)}
      data-step={step}
      data-max={max}
      data-y-label={visData.yLabel}
    />
  ),
}));

describe("NonlinearGamingRelationships", () => {
  it("uses max=20 and is not compact for idx 0", () => {
    render(<NonlinearGamingRelationships idx={0} />);
    const el = screen.getByTestId("gaming-relationships");
    expect(el).toHaveAttribute("data-compact", "false");
    expect(el).toHaveAttribute("data-max", "20");
    expect(el).toHaveAttribute("data-step", "0.02");
  });

  it("uses max=40 and is compact for idx 1", () => {
    render(<NonlinearGamingRelationships idx={1} />);
    const el = screen.getByTestId("gaming-relationships");
    expect(el).toHaveAttribute("data-compact", "true");
    expect(el).toHaveAttribute("data-max", "40");
  });

  it("parses a string idx", () => {
    render(<NonlinearGamingRelationships idx="0" />);
    expect(screen.getByTestId("gaming-relationships")).toHaveAttribute(
      "data-max",
      "20",
    );
  });
});
