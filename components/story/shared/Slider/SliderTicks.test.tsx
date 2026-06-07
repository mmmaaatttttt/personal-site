import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import SliderTicks from "./SliderTicks";

const defaultProps = {
  count: 3,
  fractionFilled: 0.5,
  activeColor: "#ff0000",
  height: 6,
  padding: 10,
};

describe("SliderTicks", () => {
  it("returns null when count is 0", () => {
    const { container } = render(<SliderTicks {...defaultProps} count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when count is negative", () => {
    const { container } = render(<SliderTicks {...defaultProps} count={-1} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the correct number of ticks", () => {
    const { container } = render(<SliderTicks {...defaultProps} count={4} />);
    expect(container.querySelectorAll(".rounded-full")).toHaveLength(4);
  });

  it("colors all ticks active when fractionFilled is 1", () => {
    const { container } = render(
      <SliderTicks
        {...defaultProps}
        count={3}
        fractionFilled={1}
        activeColor="#00ff00"
      />,
    );
    const ticks = container.querySelectorAll(".rounded-full");
    for (const tick of ticks) {
      expect(tick).toHaveStyle({ backgroundColor: "#00ff00" });
    }
  });

  it("colors all ticks inactive when fractionFilled is 0", () => {
    const { container } = render(
      <SliderTicks
        {...defaultProps}
        count={3}
        fractionFilled={0}
        inactiveColor="#cccccc"
      />,
    );
    const ticks = container.querySelectorAll(".rounded-full");
    // tick 0 at position 0/(3-1)=0 which equals fractionFilled=0, so it IS filled
    // ticks 1 and 2 are inactive
    expect(ticks[1]).toHaveStyle({ backgroundColor: "#cccccc" });
    expect(ticks[2]).toHaveStyle({ backgroundColor: "#cccccc" });
  });
});
