import { fireEvent, render, screen } from "@testing-library/react";
import { scaleLinear } from "d3-scale";
import { describe, expect, it, vi } from "vitest";
import TooltipDots, { type TooltipEntry } from "./TooltipDots";

const xScale = scaleLinear().domain([0, 2]).range([0, 200]);
const yScale = scaleLinear().domain([0, 10]).range([100, 0]);

const tooltipData: TooltipEntry[] = [
  { title: "n = 0", body: ["Series A: 1.000", "Series B: 1.500"] },
  { title: "n = 1", body: ["Series A: 2.000", "Series B: 2.500"] },
  { title: "n = 2", body: ["Series A: 3.000", "Series B: 3.500"] },
];

function renderDots(showTooltip = vi.fn(() => vi.fn())) {
  const showTooltipAt = vi.fn();
  const hideTooltip = vi.fn();

  render(
    <svg aria-label="test chart">
      <TooltipDots
        curve={[1, 2, 3]}
        color="red"
        dotRadius={3}
        xScale={xScale}
        yScale={yScale}
        tooltipData={tooltipData}
        showTooltip={showTooltip}
        showTooltipAt={showTooltipAt}
        hideTooltip={hideTooltip}
      />
    </svg>,
  );

  return { showTooltip, showTooltipAt, hideTooltip };
}

describe("TooltipDots", () => {
  it("renders one circle per curve entry", () => {
    renderDots();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("calls showTooltip with the shared per-n tooltip entry on hover", () => {
    const { showTooltip } = renderDots();
    const dots = screen.getAllByRole("button");

    fireEvent.mouseEnter(dots[1]);
    expect(showTooltip).toHaveBeenCalledWith("n = 1", [
      "Series A: 2.000",
      "Series B: 2.500",
    ]);
  });

  it("calls hideTooltip on mouse leave", () => {
    const { hideTooltip } = renderDots();
    const dots = screen.getAllByRole("button");

    fireEvent.mouseLeave(dots[0]);
    expect(hideTooltip).toHaveBeenCalled();
  });

  it("calls showTooltipAt on focus and hideTooltip on blur", () => {
    const { showTooltipAt, hideTooltip } = renderDots();
    const dots = screen.getAllByRole("button");

    fireEvent.focus(dots[2]);
    expect(showTooltipAt).toHaveBeenCalledWith(
      "n = 2",
      ["Series A: 3.000", "Series B: 3.500"],
      expect.any(Number),
      expect.any(Number),
    );

    fireEvent.blur(dots[2]);
    expect(hideTooltip).toHaveBeenCalled();
  });

  it("uses yScale(value) for cy by default", () => {
    renderDots();
    const dots = screen.getAllByRole("button");

    expect(dots[1]).toHaveAttribute("cy", String(yScale(2)));
  });

  it("uses animatedCy in place of yScale(value) when provided", () => {
    const showTooltip = vi.fn(() => vi.fn());
    const showTooltipAt = vi.fn();
    const hideTooltip = vi.fn();

    render(
      <svg aria-label="test chart">
        <TooltipDots
          curve={[1, 2, 3]}
          color="red"
          dotRadius={3}
          xScale={xScale}
          yScale={yScale}
          animatedCy={[10, 20, 30]}
          tooltipData={tooltipData}
          showTooltip={showTooltip}
          showTooltipAt={showTooltipAt}
          hideTooltip={hideTooltip}
        />
      </svg>,
    );

    const dots = screen.getAllByRole("button");
    expect(dots[1]).toHaveAttribute("cy", "20");
  });
});
