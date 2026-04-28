import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
      />
    );
    expect(screen.getByText("State")).toBeInTheDocument();
  });

  it("shows unsorted icon when not the active sort key", () => {
    render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="averageTurnout"
        ascending={true}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("⇅");
  });

  it("shows ascending icon when active and ascending", () => {
    render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="state"
        ascending={true}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("▲");
  });

  it("shows descending icon when active and descending", () => {
    render(
      <SortHeader
        label="State"
        sortKey="state"
        currentKey="state"
        ascending={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("▼");
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
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith("averageTurnout");
  });
});
