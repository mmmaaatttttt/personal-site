import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import OrchardGameHeatData from ".";

describe("OrchardGameHeatData", () => {
  it("renders a strategy select dropdown", () => {
    render(<OrchardGameHeatData />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("populates the dropdown with all strategy options plus diff", () => {
    render(<OrchardGameHeatData />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Most Plentiful Strategy");
    expect(options).toContain("Least Plentiful Strategy");
    expect(options).toContain("Random Strategy");
    expect(options).toContain("Favorite Color Strategy");
    expect(options).toContain("Largest difference between strategies");
  });

  it("renders an SVG heat chart", () => {
    const { container } = render(<OrchardGameHeatData />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders slider controls", () => {
    render(<OrchardGameHeatData />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBe(2);
  });

  it("updates the selected option when the dropdown changes", () => {
    render(<OrchardGameHeatData />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "diff" } });
    expect((select as HTMLSelectElement).value).toBe("diff");
  });
});
