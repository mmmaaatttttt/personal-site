import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import ClippedSVG from ".";

describe("ClippedSVG Component", () => {
  const defaultProps = {
    id: "test-svg",
    width: 600,
    height: 400,
    padding: 20,
  };

  it("renders correctly with viewBox and children", () => {
    const { container } = render(
      <ClippedSVG {...defaultProps}>
        <circle cx={50} cy={50} r={10} data-testid="test-child" />
      </ClippedSVG>,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 600 400");
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("generates correct clipPath and rect attributes", () => {
    const { container } = render(
      <ClippedSVG {...defaultProps}>
        <g />
      </ClippedSVG>,
    );

    const clipPath = container.querySelector("clipPath");
    expect(clipPath).toHaveAttribute("id", "clip-path-test-svg");

    const rect = clipPath?.querySelector("rect");
    // padding 20 means top=20, left=0, right=20, bottom=20 according to the code:
    // typeof padding === "number" ? { top: padding, left: 0, right: padding, bottom: padding } : padding;
    expect(rect).toHaveAttribute("x", "0");
    expect(rect).toHaveAttribute("y", "20");
    // width - left - right = 600 - 0 - 20 = 580
    expect(rect).toHaveAttribute("width", "580");
    // height - top - bottom = 400 - 20 - 20 = 360
    expect(rect).toHaveAttribute("height", "360");
  });

  it("applies clip-path to child group by default", () => {
    const { container } = render(
      <ClippedSVG {...defaultProps}>
        <g />
      </ClippedSVG>,
    );
    const g = container.querySelector("svg > g");
    expect(g).toHaveAttribute("clip-path", "url(#clip-path-test-svg)");
  });

  it("skips clip-path when clipChildren is false", () => {
    const { container } = render(
      <ClippedSVG {...defaultProps} clipChildren={false}>
        <g />
      </ClippedSVG>,
    );
    const g = container.querySelector("svg > g");
    expect(g).not.toHaveAttribute("clip-path");
  });

  it("accepts padding as an object", () => {
    const objectPadding = { top: 10, left: 15, right: 20, bottom: 25 };
    const { container } = render(
      <ClippedSVG id="obj-pad" width={600} height={400} padding={objectPadding}>
        <g />
      </ClippedSVG>,
    );
    const clipPath = container.querySelector("clipPath");
    const rect = clipPath?.querySelector("rect");
    // x=left=15, y=top=10, width=600-15-20=565, height=400-10-25=365
    expect(rect).toHaveAttribute("x", "15");
    expect(rect).toHaveAttribute("y", "10");
    expect(rect).toHaveAttribute("width", "565");
    expect(rect).toHaveAttribute("height", "365");
  });
});
