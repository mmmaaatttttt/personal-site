import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PAdicCalculator from ".";

vi.mock("katex", () => ({
  default: { render: vi.fn() },
}));
vi.mock("katex/dist/katex.min.css", () => ({}));

describe("PAdicCalculator", () => {
  it("renders without crashing", () => {
    render(<PAdicCalculator />);
    expect(screen.getByLabelText("Number 1")).toBeTruthy();
    expect(screen.getByLabelText("Number 2")).toBeTruthy();
  });

  it("renders the prime selector with default value 2", () => {
    render(<PAdicCalculator />);
    const select = screen.getByRole("combobox");
    expect((select as HTMLSelectElement).value).toBe("2");
  });

  it("renders the formula container", () => {
    render(<PAdicCalculator />);
    expect(
      document.querySelector("[data-testid='padic-formula']"),
    ).toBeTruthy();
  });

  it("does not clamp numbers within the valid range", () => {
    render(<PAdicCalculator />);
    const input = screen.getByLabelText("Number 1");
    fireEvent.change(input, { target: { value: "42" } });
    expect((input as HTMLInputElement).value).not.toBe("0");
  });

  it("ignores a number entered outside the valid range", async () => {
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;

    render(<PAdicCalculator />);
    const input = screen.getByLabelText("Number 1");
    renderSpy.mockClear();

    fireEvent.change(input, { target: { value: "2000000" } });
    // Out of range: state doesn't change, so the formula never re-renders.
    expect(renderSpy).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "42" } });
    // Sanity check: an in-range value does trigger a re-render.
    expect(renderSpy).toHaveBeenCalled();
  });

  it("changing prime updates the formula (katex.render is called again)", async () => {
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;
    renderSpy.mockClear();

    render(<PAdicCalculator />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "3" } });
    // Latex re-renders when str changes → katex.render called at least once
    expect(renderSpy).toHaveBeenCalled();
  });

  it("all prime options are available in the dropdown", () => {
    render(<PAdicCalculator />);
    const options = screen.getAllByRole("option");
    const values = options.map((o) => (o as HTMLOptionElement).value);
    expect(values).toContain("2");
    expect(values).toContain("23");
    expect(options).toHaveLength(9);
  });
});
