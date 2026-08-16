import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import {
  DEFAULT_NON_RESPONDER_COMPLETION,
  DEFAULT_RESPONDER_COMPLETION,
  DEFAULT_TRUE_RATE,
  NON_RESPONDER_COMPLETION_KEY,
  RESPONDER_COMPLETION_KEY,
  TRUE_RATE_KEY,
} from "../../sliderStore";
import AttritionBias from ".";

vi.mock("katex", () => ({
  default: { render: vi.fn() },
}));
vi.mock("katex/dist/katex.min.css", () => ({}));

beforeEach(() => {
  writeMemoryItem(TRUE_RATE_KEY, DEFAULT_TRUE_RATE);
  writeMemoryItem(RESPONDER_COMPLETION_KEY, DEFAULT_RESPONDER_COMPLETION);
  writeMemoryItem(
    NON_RESPONDER_COMPLETION_KEY,
    DEFAULT_NON_RESPONDER_COMPLETION,
  );
});

describe("AttritionBias", () => {
  it("renders without crashing", () => {
    render(<AttritionBias />);
    expect(screen.getByTestId("true-rate-formula")).toBeTruthy();
    expect(screen.getByTestId("observed-rate-formula")).toBeTruthy();
  });

  it("renders the true rate and observed rate labels above their formulas", () => {
    render(<AttritionBias />);
    expect(screen.getByText("True rate")).toBeInTheDocument();
    expect(screen.getByText("Observed rate")).toBeInTheDocument();
  });

  it("renders one slider for the true rate, responder dropout, and non-responder dropout", () => {
    render(<AttritionBias />);
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });

  it("re-renders both formulas when a slider value changes", async () => {
    render(<AttritionBias />);
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;
    renderSpy.mockClear();

    const [trueResponseRateSlider] = screen.getAllByRole("slider");
    fireEvent.change(trueResponseRateSlider, { target: { value: "0.8" } });

    expect(renderSpy).toHaveBeenCalled();
  });
});
