import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EvPill from "./EvPill";

describe("EvPill", () => {
  it("formats the value to 3 decimal places", () => {
    render(<EvPill value={-0.004999999999999893} variant="neutral" />);
    expect(screen.getByText("-0.005")).toBeInTheDocument();
  });

  it("applies the optimal variant styling", () => {
    render(<EvPill value={1} variant="optimal" />);
    expect(screen.getByText("1.000")).toHaveClass("bg-green-100");
  });

  it("applies the selected-wrong variant styling", () => {
    render(<EvPill value={1} variant="selected-wrong" />);
    expect(screen.getByText("1.000")).toHaveClass("bg-red-100");
  });

  it("applies the neutral variant styling", () => {
    render(<EvPill value={1} variant="neutral" />);
    expect(screen.getByText("1.000")).toHaveClass("bg-white");
  });
});
