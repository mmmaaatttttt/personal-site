import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import CommonPhrasesInteractive from "./index";

// Mock shared components
vi.mock("@/components/story/shared/Slider/SliderProvider", () => ({
  default: ({ initialData, render }: any) => (
    <div data-testid="mock-slider-provider">
      {render([initialData[0].initialValue])}
    </div>
  ),
}));

vi.mock("@/components/story/shared/StyledTable", () => ({
  default: ({ headers, rows }: any) => (
    <div data-testid="mock-styled-table">
      <div data-testid="headers-count">{headers.length}</div>
      <div data-testid="rows-count">{rows.length}</div>
    </div>
  ),
}));

describe("CommonPhrasesInteractive Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and transforms data for the initial phrase count", () => {
    render(<CommonPhrasesInteractive />);

    expect(
      screen.getByTestId("common-phrases-interactive-container"),
    ).toBeInTheDocument();

    // Chris and Caller headers
    expect(screen.getByTestId("headers-count")).toHaveTextContent("2");

    // Should have some rows for the initial phrase count
    const rowsCount = parseInt(
      screen.getByTestId("rows-count").textContent || "0",
    );
    expect(rowsCount).toBeGreaterThan(0);
  });
});
