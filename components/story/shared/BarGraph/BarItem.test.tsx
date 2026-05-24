import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import BarItem from "./BarItem";

vi.mock("framer-motion", () => ({
  motion: {
    rect: ({
      animate: _a,
      initial: _i,
      transition: _t,
      ...rest
    }: Record<string, unknown>) => <rect {...rest} />,
    text: ({
      animate: _a,
      initial: _i,
      transition: _t,
      ...rest
    }: Record<string, unknown>) => <text {...rest} />,
  },
}));

const defaultData = { key: "a", height: 50 };
const defaultProps = {
  data: defaultData,
  index: 0,
  x: 10,
  y: 20,
  width: 100,
  height: 50,
  color: "steelblue",
  fontSize: "100%",
};

describe("BarItem", () => {
  it("renders a rect element", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <BarItem {...defaultProps} />
      </svg>,
    );
    expect(container.querySelector("rect")).toBeInTheDocument();
  });

  it("renders bar label text when barLabel is provided", () => {
    render(
      <svg role="img" aria-label="test">
        <BarItem {...defaultProps} barLabel={(d) => `$${d.height}`} />
      </svg>,
    );
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("does not render label text when barLabel is absent", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <BarItem {...defaultProps} />
      </svg>,
    );
    expect(container.querySelector("text")).toBeNull();
  });

  it("accepts animated={false} without crashing", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <BarItem {...defaultProps} animated={false} />
      </svg>,
    );
    expect(container.querySelector("rect")).toBeInTheDocument();
  });

  it("accepts data.color override without crashing", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <BarItem {...defaultProps} data={{ ...defaultData, color: "red" }} />
      </svg>,
    );
    expect(container.querySelector("rect")).toBeInTheDocument();
  });
});
