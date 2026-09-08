import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TooltipMarker from ".";

function renderMarker(
  props: Partial<{ title: string; body: string | string[] }> = {},
  showTooltip = vi.fn(() => vi.fn()),
) {
  const showTooltipAt = vi.fn();
  const hideTooltip = vi.fn();

  render(
    <svg aria-label="test chart">
      <TooltipMarker
        cx={10}
        cy={20}
        r={6}
        fill="red"
        body="Switch after you have 96 standees in your collection"
        {...props}
        showTooltip={showTooltip}
        showTooltipAt={showTooltipAt}
        hideTooltip={hideTooltip}
      />
    </svg>,
  );

  return { showTooltip, showTooltipAt, hideTooltip };
}

describe("TooltipMarker", () => {
  it("renders a circle at the given position", () => {
    renderMarker();
    const marker = screen.getByRole("button");
    expect(marker).toHaveAttribute("cx", "10");
    expect(marker).toHaveAttribute("cy", "20");
    expect(marker).toHaveAttribute("fill", "red");
  });

  it("calls showTooltip with an empty title and the body by default", () => {
    const { showTooltip } = renderMarker();
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(showTooltip).toHaveBeenCalledWith(
      "",
      "Switch after you have 96 standees in your collection",
    );
  });

  it("calls showTooltip with a title and array body when provided", () => {
    const { showTooltip } = renderMarker({
      title: "n = 1",
      body: ["Series A: 2.000", "Series B: 2.500"],
    });
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(showTooltip).toHaveBeenCalledWith("n = 1", [
      "Series A: 2.000",
      "Series B: 2.500",
    ]);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "n = 1: Series A: 2.000; Series B: 2.500",
    );
  });

  it("calls hideTooltip on mouse leave", () => {
    const { hideTooltip } = renderMarker();
    fireEvent.mouseLeave(screen.getByRole("button"));
    expect(hideTooltip).toHaveBeenCalled();
  });

  it("calls showTooltipAt on focus and hideTooltip on blur", () => {
    const { showTooltipAt, hideTooltip } = renderMarker();
    const marker = screen.getByRole("button");

    fireEvent.focus(marker);
    expect(showTooltipAt).toHaveBeenCalledWith(
      "",
      "Switch after you have 96 standees in your collection",
      expect.any(Number),
      expect.any(Number),
    );

    fireEvent.blur(marker);
    expect(hideTooltip).toHaveBeenCalled();
  });
});
