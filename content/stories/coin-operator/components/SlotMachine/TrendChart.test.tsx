import { fireEvent, render, screen } from "@testing-library/react";
import { animate } from "framer-motion";
import { describe, expect, it, vi } from "vitest";
import type { RoundRecord } from "./constants";
import TrendChart from "./TrendChart";

// animate() is imperative and doesn't run in jsdom — mock it as a no-op by
// default; one test below overrides it to exercise onUpdate/cleanup.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

const oneRound: RoundRecord[] = [{ round: 1, revenue: 3, cost: 1, profit: 2 }];

const threeRounds: RoundRecord[] = [
  { round: 1, revenue: 3, cost: 1, profit: 2 },
  { round: 2, revenue: 3, cost: 2, profit: 1 },
  { round: 3, revenue: 8, cost: 3, profit: 5 },
];

const getXAxisTicks = () =>
  document.querySelectorAll(".axis-group")[1]?.querySelectorAll(".tick") ?? [];

const getYAxisTickLabels = () =>
  Array.from(
    document
      .querySelectorAll(".axis-group")[0]
      ?.querySelectorAll(".tick text") ?? [],
  ).map((el) => el.textContent);

describe("TrendChart", () => {
  it("renders a chart with axes even before any rounds have been played", () => {
    render(<TrendChart history={[]} />);
    expect(screen.queryByRole("img")).toBeInTheDocument();
    expect(getXAxisTicks()).toHaveLength(2); // 0, 1
  });

  it("renders a chart for a single round without a degenerate domain", () => {
    render(<TrendChart history={oneRound} />);
    expect(screen.queryByRole("img")).toBeInTheDocument();
    expect(getXAxisTicks()).toHaveLength(2); // 0, 1
  });

  it("caps x-axis ticks at the number of rounds played, never beyond it", () => {
    render(<TrendChart history={threeRounds} />);
    expect(getXAxisTicks()).toHaveLength(4); // 0, 1, 2, 3
  });

  it("never repeats a y-axis tick label — minimum tick step is 1", () => {
    render(<TrendChart history={oneRound} />);
    const labels = getYAxisTickLabels();
    expect(labels.length).toBeGreaterThan(0);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("switches the plotted series when a different option is selected", () => {
    render(<TrendChart history={threeRounds} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "cost" } });
    expect(select).toHaveValue("cost");
  });

  it("animates point positions as rounds are added, cleaning up prior animations on change and unmount", () => {
    const stop = vi.fn();
    vi.mocked(animate).mockImplementation((_from, _to, options) => {
      (options as { onUpdate?: (v: number) => void }).onUpdate?.(100);
      return { stop } as unknown as ReturnType<typeof animate>;
    });

    const { rerender, unmount } = render(<TrendChart history={oneRound} />);
    rerender(<TrendChart history={threeRounds} />);
    expect(stop).toHaveBeenCalled();

    stop.mockClear();
    unmount();
    expect(stop).toHaveBeenCalled();
  });
});
