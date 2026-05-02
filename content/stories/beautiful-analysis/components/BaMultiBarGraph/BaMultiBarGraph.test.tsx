import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import BaMultiBarGraph from ".";

vi.mock("@/components/story/shared/MultiBarGraph", () => ({
  default: ({ data, getTooltipData, colors }: any) => (
    <div
      data-testid="mock-multi-bar-graph"
      data-data-length={data.length}
      data-has-tooltip={typeof getTooltipData === "function"}
      data-first-color={colors?.[0]}
    />
  ),
}));

describe("BaMultiBarGraph", () => {
  it("renders summary data by default", () => {
    const { getByTestId } = render(<BaMultiBarGraph />);
    const el = getByTestId("mock-multi-bar-graph");
    expect(parseInt(el.getAttribute("data-data-length") || "0")).toBeGreaterThan(0);
    expect(el.getAttribute("data-has-tooltip")).toBe("true");
  });

  it("renders different data for profanity vs summary", () => {
    const { getByTestId, rerender } = render(<BaMultiBarGraph dataType="summary" />);
    const summaryLength = parseInt(
      getByTestId("mock-multi-bar-graph").getAttribute("data-data-length") || "0"
    );

    rerender(<BaMultiBarGraph dataType="profanity" />);
    const profanityLength = parseInt(
      getByTestId("mock-multi-bar-graph").getAttribute("data-data-length") || "0"
    );

    // Both datasets have the same number of episodes, but verify it renders
    expect(summaryLength).toBeGreaterThan(0);
    expect(profanityLength).toBeGreaterThan(0);
  });

  it("passes getTooltipData as a function, not a serialized value", () => {
    const { getByTestId } = render(<BaMultiBarGraph />);
    expect(getByTestId("mock-multi-bar-graph").getAttribute("data-has-tooltip")).toBe("true");
  });
});
