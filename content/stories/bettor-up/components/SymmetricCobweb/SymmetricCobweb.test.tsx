import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import SymmetricCobweb from ".";

describe("SymmetricCobweb", () => {
  it("renders two sliders and the chart", () => {
    render(<SymmetricCobweb />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("accepts changes to the curviness slider without crashing", () => {
    render(<SymmetricCobweb />);
    const [kSlider] = screen.getAllByRole("slider");
    fireEvent.change(kSlider, { target: { value: "8" } });
    expect(kSlider).toHaveValue("8");
  });

  it("accepts changes to the starting-price slider without crashing", () => {
    render(<SymmetricCobweb />);
    const [, p0Slider] = screen.getAllByRole("slider");
    fireEvent.change(p0Slider, { target: { value: "0.8" } });
    expect(p0Slider).toHaveValue("0.8");
  });
});
