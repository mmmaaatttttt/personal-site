import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import LoopGainReadout from "./LoopGainReadout";

describe("LoopGainReadout", () => {
  it("renders the gain formatted to two decimal places", () => {
    render(<LoopGainReadout gain={0.5} />);
    expect(screen.getByText("0.50")).toBeInTheDocument();
  });

  it("colors the readout green when the gain is below the threshold", () => {
    render(<LoopGainReadout gain={0.5} />);
    expect(screen.getByText("0.50")).toHaveClass("text-green-700");
  });

  it("colors the readout red when the gain is above the threshold", () => {
    render(<LoopGainReadout gain={1.5} />);
    expect(screen.getByText("1.50")).toHaveClass("text-red-600");
  });

  it("colors a negative gain by its absolute value against the threshold", () => {
    render(<LoopGainReadout gain={-1.5} />);
    expect(screen.getByText("-1.50")).toHaveClass("text-red-600");
  });

  it("respects a custom threshold", () => {
    render(<LoopGainReadout gain={1.5} threshold={2} />);
    expect(screen.getByText("1.50")).toHaveClass("text-green-700");
  });
});
