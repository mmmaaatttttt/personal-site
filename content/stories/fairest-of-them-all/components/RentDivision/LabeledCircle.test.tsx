import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LabeledCircle from "./LabeledCircle";

const defaultProps = {
  x: 50,
  y: 50,
  r: 10,
  color: "#555555",
  label: "A",
};

describe("LabeledCircle", () => {
  it("renders a circle with the correct position and color", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <LabeledCircle {...defaultProps} />
      </svg>,
    );
    const circle = container.querySelector("circle") as SVGCircleElement;
    expect(circle.getAttribute("cx")).toBe("50");
    expect(circle.getAttribute("cy")).toBe("50");
    expect(circle.getAttribute("fill")).toBe("#555555");
  });

  it("renders the label text", () => {
    render(
      <svg role="img" aria-label="test">
        <LabeledCircle {...defaultProps} />
      </svg>,
    );
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("injects pulse keyframe style when isActive=true", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <LabeledCircle {...defaultProps} isActive />
      </svg>,
    );
    expect(container.querySelector("style")).toBeTruthy();
    expect(container.querySelector(".rent-circle-active")).toBeTruthy();
  });

  it("does not add active class when isActive=false", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <LabeledCircle {...defaultProps} isActive={false} />
      </svg>,
    );
    expect(container.querySelector(".rent-circle-active")).toBeNull();
  });

  it("calls handleLeave on mouse leave", () => {
    const handleLeave = vi.fn();
    const { container } = render(
      <svg role="img" aria-label="test">
        <LabeledCircle {...defaultProps} handleLeave={handleLeave} />
      </svg>,
    );
    fireEvent.mouseLeave(container.querySelector("g") as SVGGElement);
    expect(handleLeave).toHaveBeenCalled();
  });
});
