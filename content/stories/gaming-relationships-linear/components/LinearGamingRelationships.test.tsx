import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import type { GamingVisData } from "@/components/story/shared/GamingRelationships";
import LinearGamingRelationships from "./LinearGamingRelationships";

vi.mock("@/components/story/shared/GamingRelationships", () => ({
  default: ({
    visData,
    compact,
  }: {
    visData: GamingVisData;
    compact?: boolean;
  }) => (
    <div
      data-testid="gaming-relationships"
      data-compact={String(compact)}
      data-y-label={visData.yLabel}
    />
  ),
}));

describe("LinearGamingRelationships", () => {
  it("passes the visData for a numeric idx and is not compact at idx 0", () => {
    render(<LinearGamingRelationships idx={0} />);
    const el = screen.getByTestId("gaming-relationships");
    expect(el).toHaveAttribute("data-compact", "false");
    expect(el).toHaveAttribute("data-y-label", "Feelings");
  });

  it("is compact for a non-zero idx", () => {
    render(<LinearGamingRelationships idx={1} />);
    expect(screen.getByTestId("gaming-relationships")).toHaveAttribute(
      "data-compact",
      "true",
    );
  });

  it("parses a string idx", () => {
    render(<LinearGamingRelationships idx="2" />);
    expect(screen.getByTestId("gaming-relationships")).toHaveAttribute(
      "data-compact",
      "true",
    );
  });
});
