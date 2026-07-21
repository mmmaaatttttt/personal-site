import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BonusSpinEvChart from ".";
import { BOUNDED_COLOR, MAX_BONUS_SPINS, OPTIMAL_COLOR } from "./constants";

// animate() is imperative and doesn't run in jsdom — mock it as a no-op.
// Because it never fires onUpdate, animatedCy falls back to yScale(value)
// for every dot, so tests see stable, deterministic positions.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, animate: vi.fn() };
});

// Every test here renders 302 dots (two series x MAX_BONUS_SPINS+1) and may
// trigger a full bounded-rational curve recompute; under full-suite parallel
// worker contention this can run well past vitest's 5s default.
const SLOW_TEST_TIMEOUT = 20000;

describe("BonusSpinEvChart", () => {
  it(
    "renders the slider defaulting to fully rational (r=1)",
    () => {
      render(<BonusSpinEvChart />);
      const slider = screen.getByRole("slider");

      expect(slider).toHaveValue("1");
      expect(
        screen.getByText("Optimality measurement: 1.00"),
      ).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "updates the slider label as the value changes",
    () => {
      render(<BonusSpinEvChart />);
      const slider = screen.getByRole("slider");

      fireEvent.change(slider, { target: { value: "0.25" } });

      expect(
        screen.getByText("Optimality measurement: 0.25"),
      ).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "shows a legend distinguishing the two series",
    () => {
      render(<BonusSpinEvChart />);

      expect(screen.getByText("Optimal")).toBeInTheDocument();
      expect(screen.getByText("Suboptimal")).toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "renders one dot per integer spin count for each of the two series",
    () => {
      render(<BonusSpinEvChart />);

      // (MAX_BONUS_SPINS + 1) points per series, two series.
      expect(screen.getAllByRole("button")).toHaveLength(
        2 * (MAX_BONUS_SPINS + 1),
      );
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "renders the bounded-rational series before the optimal series, so optimal always paints on top",
    () => {
      render(<BonusSpinEvChart />);
      const dots = screen.getAllByRole("button");

      // Bounded-rational dots come first in DOM order; optimal dots come
      // last, which in SVG means optimal paints on top. Both series now
      // share identical tooltip content per n, so distinguish by fill color.
      expect(dots[0]).toHaveAttribute("fill", BOUNDED_COLOR);
      expect(dots[dots.length - 1]).toHaveAttribute("fill", OPTIMAL_COLOR);
    },
    SLOW_TEST_TIMEOUT,
  );

  it(
    "shows a combined tooltip with both series' values on hover, and hides it on mouse leave",
    () => {
      render(<BonusSpinEvChart />);
      const dots = screen.getAllByRole("button");
      const lastDot = dots[dots.length - 1];

      fireEvent.mouseEnter(lastDot);
      expect(screen.getByText(`n = ${MAX_BONUS_SPINS}`)).toBeInTheDocument();
      // Tooltip renders each body line as its own list item, so these are
      // distinct from the legend's bare "Optimal"/"Suboptimal" text.
      expect(screen.getByText(/^Optimal: /)).toBeInTheDocument();
      expect(screen.getByText(/^Suboptimal: /)).toBeInTheDocument();

      fireEvent.mouseLeave(lastDot);
      expect(
        screen.queryByText(`n = ${MAX_BONUS_SPINS}`),
      ).not.toBeInTheDocument();
    },
    SLOW_TEST_TIMEOUT,
  );
});
