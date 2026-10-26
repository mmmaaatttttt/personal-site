import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import RankDelta from "./RankDelta";

describe("RankDelta", () => {
  it("renders a plain dash when there is no previous year to compare", () => {
    const { container } = render(<RankDelta rankDelta={null} />);
    expect(container).toHaveTextContent("—");
    expect(container.querySelector("span")).toBeNull();
  });

  it("renders a muted dash when the rank is unchanged", () => {
    render(<RankDelta rankDelta={0} />);
    expect(screen.getByText("—")).toHaveClass("text-gray-400");
  });

  it("renders an up arrow and screen-reader text when the rank improves", () => {
    render(<RankDelta rankDelta={2} />);
    expect(screen.getByText("improved by 2")).toHaveClass("sr-only");
    expect(screen.getByText("▲ 2")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a down arrow and screen-reader text when the rank worsens", () => {
    render(<RankDelta rankDelta={-3} />);
    expect(screen.getByText("worsened by 3")).toHaveClass("sr-only");
    expect(screen.getByText("▼ 3")).toHaveAttribute("aria-hidden", "true");
  });
});
