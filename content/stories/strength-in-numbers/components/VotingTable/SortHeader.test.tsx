import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import SortHeader from "./SortHeader";

describe("SortHeader", () => {
  it("renders the label", () => {
    render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="averageTurnout"
        ascending={true}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByText("State")).toBeInTheDocument();
  });

  it("renders an SVG icon in the sort button", () => {
    const { container } = render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="averageTurnout"
        ascending={true}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("button svg")).toBeInTheDocument();
  });

  it("renders an SVG icon when active and ascending", () => {
    const { container } = render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="state"
        ascending={true}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("button svg")).toBeInTheDocument();
  });

  it("renders an SVG icon when active and descending", () => {
    const { container } = render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="state"
        ascending={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("button svg")).toBeInTheDocument();
  });

  it("calls onClick with the sort key when clicked", () => {
    const handleClick = vi.fn();
    render(
      <SortHeader
        label="Average Turnout"
        sortKey="averageTurnout"
        currentKey="state"
        ascending={true}
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith("averageTurnout");
  });
});
