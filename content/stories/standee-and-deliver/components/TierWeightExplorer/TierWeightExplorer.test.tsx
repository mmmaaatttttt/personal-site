import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_NUM_STANDEES,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  NUM_STANDEES_KEY,
  RANDOM_COST_KEY,
} from "../../sliderStore";
import TierWeightExplorer from ".";

beforeEach(() => {
  SVGSVGElement.prototype.getScreenCTM = vi
    .fn()
    .mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  writeMemoryItem(RANDOM_COST_KEY, DEFAULT_RANDOM_COST);
  writeMemoryItem(GUARANTEED_MULTIPLIER_KEY, DEFAULT_GUARANTEED_MULTIPLIER);
  writeMemoryItem(NUM_STANDEES_KEY, 20);
});

describe("TierWeightExplorer", () => {
  it("renders the ternary plot, cost sliders, legend, and chart", () => {
    render(<TierWeightExplorer numStandees={20} />);
    expect(screen.getByText("Black: 27.3%")).toBeInTheDocument();
    expect(screen.getByText("Silver: 36.4%")).toBeInTheDocument();
    expect(screen.getByText("Gold: 36.4%")).toBeInTheDocument();
    expect(screen.getByText(/Number of Standees: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Random Cost per Standee/)).toBeInTheDocument();
    expect(
      screen.getByText(/Guaranteed Cost Per Standee: 3x Random Cost/),
    ).toBeInTheDocument();
    expect(screen.getByText("Uniform Odds (Exact)")).toBeInTheDocument();
    expect(screen.getByText("Weighted Odds (Exact)")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "tier-weight-explorer" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll("path:not(.domain)")).toHaveLength(2);
    expect(
      document.querySelector("circle[fill='#52a081']"),
    ).toBeInTheDocument();
    expect(
      document.querySelector("circle[fill='#2227ff']"),
    ).toBeInTheDocument();
  });

  it("recomputes both curves and the vertex percentages when the ternary plot point is dragged", () => {
    render(<TierWeightExplorer numStandees={20} />);
    const point = document.querySelector(
      "circle[fill='#ff3c23']",
    ) as SVGCircleElement;
    fireEvent.pointerDown(point);
    fireEvent.pointerMove(point, { clientX: 20, clientY: 212 });
    expect(
      screen.getByRole("img", { name: "tier-weight-explorer" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Black: 27.3%")).not.toBeInTheDocument();
  });

  it("keeps every tier's weight above zero even when dragged onto a vertex", () => {
    render(<TierWeightExplorer numStandees={20} />);
    const point = document.querySelector(
      "circle[fill='#ff3c23']",
    ) as SVGCircleElement;
    fireEvent.pointerDown(point);
    fireEvent.pointerMove(point, { clientX: 28, clientY: 212 });
    expect(screen.getByText("Black: 98.0%")).toBeInTheDocument();
    expect(screen.getByText("Silver: 1.0%")).toBeInTheDocument();
    expect(screen.getByText("Gold: 1.0%")).toBeInTheDocument();
    expect(document.querySelectorAll("path:not(.domain)")).toHaveLength(2);
    expect(
      screen.getByRole("img", { name: "tier-weight-explorer" }),
    ).toBeInTheDocument();
  });

  it("falls back to the default total when numStandees is not passed", () => {
    writeMemoryItem(NUM_STANDEES_KEY, DEFAULT_NUM_STANDEES);
    render(<TierWeightExplorer />);
    expect(
      screen.getByRole("img", { name: "tier-weight-explorer" }),
    ).toBeInTheDocument();
  });

  it("aligns the two minima exactly when tier weights are uniform", () => {
    writeMemoryItem(NUM_STANDEES_KEY, DEFAULT_NUM_STANDEES);
    render(<TierWeightExplorer />);
    const uniformMinimum = document.querySelector("circle[fill='#52a081']");
    const weightedMinimum = document.querySelector("circle[fill='#2227ff']");
    expect(uniformMinimum?.getAttribute("cx")).toBe(
      weightedMinimum?.getAttribute("cx"),
    );
    expect(uniformMinimum?.getAttribute("cy")).toBe(
      weightedMinimum?.getAttribute("cy"),
    );
  });

  it("returns to an exact overlap after dragging away and back near center", () => {
    writeMemoryItem(NUM_STANDEES_KEY, DEFAULT_NUM_STANDEES);
    render(<TierWeightExplorer />);
    const point = document.querySelector(
      "circle[fill='#ff3c23']",
    ) as SVGCircleElement;
    fireEvent.pointerDown(point);
    fireEvent.pointerMove(point, { clientX: 28, clientY: 212 });
    expect(screen.getByText("Black: 98.0%")).toBeInTheDocument();

    fireEvent.pointerMove(point, { clientX: 150, clientY: 145 });
    expect(screen.getByText("Black: 27.3%")).toBeInTheDocument();
    expect(screen.getByText("Silver: 36.4%")).toBeInTheDocument();
    expect(screen.getByText("Gold: 36.4%")).toBeInTheDocument();

    const uniformMinimum = document.querySelector("circle[fill='#52a081']");
    const weightedMinimum = document.querySelector("circle[fill='#2227ff']");
    expect(uniformMinimum?.getAttribute("cx")).toBe(
      weightedMinimum?.getAttribute("cx"),
    );
    expect(uniformMinimum?.getAttribute("cy")).toBe(
      weightedMinimum?.getAttribute("cy"),
    );
  });

  it("uses singular 'coin' when the random cost slider is set to 1", () => {
    render(<TierWeightExplorer numStandees={20} />);
    const slider = screen.getAllByRole("slider")[1];
    fireEvent.change(slider, { target: { value: "1" } });
    expect(
      screen.getByText(/Random Cost per Standee: 1 coin$/),
    ).toBeInTheDocument();
  });

  it("recomputes the tier counts and chart when the number of standees slider changes", () => {
    render(<TierWeightExplorer numStandees={20} />);
    const slider = screen.getAllByRole("slider")[0];
    fireEvent.change(slider, { target: { value: "12" } });
    expect(screen.getByText(/Number of Standees: 12/)).toBeInTheDocument();
  });
});
