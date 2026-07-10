import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CoalitionChart from ".";

beforeEach(() => {
  localStorage.clear();
});

describe("CoalitionChart", () => {
  it("renders without crashing", () => {
    render(<CoalitionChart />);
  });

  it("renders 5 slider inputs (4 base + coalition size)", () => {
    render(<CoalitionChart />);
    expect(screen.getAllByRole("slider")).toHaveLength(5);
  });

  it("shows axis labels", () => {
    render(<CoalitionChart />);
    expect(screen.getByText("Company profit change")).toBeInTheDocument();
    expect(screen.getByText("Share of jobs automated")).toBeInTheDocument();
  });

  it("shows Coordinated, Market, and Coalition vertical marker labels", () => {
    render(<CoalitionChart />);
    expect(screen.getByText("Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Market")).toBeInTheDocument();
    expect(screen.getByText("Coalition")).toBeInTheDocument();
  });

  it("renders the SVG chart element", () => {
    const { container } = render(<CoalitionChart />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("clamps the coalition size slider when numFirms shrinks below it", () => {
    render(<CoalitionChart />);
    const sliders = screen.getAllByRole("slider");
    // numFirms is the 4th base slider (index 3); coalition size is 5th (index 4)
    const numFirmsSlider = sliders[3];
    const coalitionSlider = sliders[4];

    fireEvent.change(coalitionSlider, { target: { value: "6" } });
    fireEvent.change(numFirmsSlider, { target: { value: "3" } });

    expect(
      Number((coalitionSlider as HTMLInputElement).value),
    ).toBeLessThanOrEqual(3);
  });
});
