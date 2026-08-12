import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import SymmetricCobweb from ".";

function getGainReadout(container: HTMLElement) {
  return container.querySelector("span.text-lg.font-bold") as HTMLElement;
}

describe("SymmetricCobweb", () => {
  it("renders two sliders, the chart, and the gain readout", () => {
    render(<SymmetricCobweb />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("shows the initial loop gain as k/4", () => {
    const { container } = render(<SymmetricCobweb />);
    expect(getGainReadout(container)).toHaveTextContent("1.00");
  });

  it("updates the gain readout when the k slider changes", () => {
    const { container } = render(<SymmetricCobweb />);
    const [kSlider] = screen.getAllByRole("slider");
    fireEvent.change(kSlider, { target: { value: "8" } });
    expect(getGainReadout(container)).toHaveTextContent("2.00");
  });

  it("accepts changes to the starting-price slider without crashing", () => {
    render(<SymmetricCobweb />);
    const [, p0Slider] = screen.getAllByRole("slider");
    fireEvent.change(p0Slider, { target: { value: "0.8" } });
    expect(p0Slider).toHaveValue("0.8");
  });
});
