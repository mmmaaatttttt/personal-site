import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AutomationRateCalculator from ".";

vi.mock("katex", () => ({
  default: { render: vi.fn() },
}));
vi.mock("katex/dist/katex.min.css", () => ({}));

describe("AutomationRateCalculator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", () => {
    render(<AutomationRateCalculator />);
    expect(screen.getByTestId("nash-formula")).toBeTruthy();
    expect(screen.getByTestId("cooperative-formula")).toBeTruthy();
  });

  it("renders one slider for each of savings, demand loss, difficulty, and number of firms", () => {
    render(<AutomationRateCalculator />);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
  });

  it("re-renders both formulas when a slider value changes", async () => {
    render(<AutomationRateCalculator />);
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;
    renderSpy.mockClear();

    const [savingsSlider] = screen.getAllByRole("slider");
    fireEvent.change(savingsSlider, { target: { value: "0.9" } });

    expect(renderSpy).toHaveBeenCalled();
  });
});
