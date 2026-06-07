import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import GerrymanderGrid from "./GerrymanderGrid";

const defaultProps = {
  width: 450,
  height: 300,
  paddingX: 33.75,
  paddingY: 22.5,
  rowCount: 6,
  colCount: 9,
  colorRange: [COLORS.DARK_BLUE, COLORS.RED] as [string, string],
};

describe("GerrymanderGrid", () => {
  it("renders without crashing", () => {
    render(<GerrymanderGrid {...defaultProps} />);
  });

  it("renders the correct number of cells", () => {
    const { container } = render(<GerrymanderGrid {...defaultProps} />);
    // Filter out the clip-path <rect> inside <defs>
    const rects = Array.from(container.querySelectorAll("rect")).filter(
      (el) => !el.closest("defs"),
    );
    expect(rects).toHaveLength(defaultProps.rowCount * defaultProps.colCount);
  });

  it("renders children inside the SVG", () => {
    render(
      <GerrymanderGrid {...defaultProps}>
        <g data-testid="overlay" />
      </GerrymanderGrid>,
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });

  it("colors even rows with the first color and odd rows with the second", () => {
    const { container } = render(<GerrymanderGrid {...defaultProps} />);
    // Exclude clip-path rect inside <defs>; cells render column-major: (x=0,y=0), (x=0,y=1), ...
    const rects = Array.from(container.querySelectorAll("rect")).filter(
      (el) => !el.closest("defs"),
    );
    expect(rects[0].getAttribute("fill")).toBe(COLORS.DARK_BLUE); // (x=0, y=0) → y%2===0
    expect(rects[1].getAttribute("fill")).toBe(COLORS.RED); // (x=0, y=1) → y%2===1
  });
});
