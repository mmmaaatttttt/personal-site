import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({
        animate: _a,
        transition: _t,
        ...rest
      }: {
        animate?: unknown;
        transition?: unknown;
        [key: string]: unknown;
      }) => <div {...rest} />,
    },
  };
});

import LabeledSlider from "./LabeledSlider";

const defaultProps = {
  min: 0,
  max: 100,
  value: 50,
  handleValueChange: vi.fn(),
  title: "My Slider",
  color: "#4488ff",
};

describe("LabeledSlider", () => {
  it("renders the title", () => {
    render(<LabeledSlider {...defaultProps} />);
    expect(screen.getByText("My Slider")).toBeInTheDocument();
  });

  it("does not render a title element when title is empty", () => {
    const { container } = render(<LabeledSlider {...defaultProps} title="" />);
    expect(container.querySelector(".text-xs.font-semibold")).toBeNull();
  });

  it("renders a range input", () => {
    render(<LabeledSlider {...defaultProps} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("applies compact margin class when compact is true", () => {
    const { container } = render(<LabeledSlider {...defaultProps} compact />);
    expect(container.querySelector(".mb-0.text-xs")).toBeInTheDocument();
  });

  it("applies normal margin class when compact is false (default)", () => {
    const { container } = render(<LabeledSlider {...defaultProps} />);
    expect(container.querySelector(".mb-2.text-xs")).toBeInTheDocument();
  });
});
