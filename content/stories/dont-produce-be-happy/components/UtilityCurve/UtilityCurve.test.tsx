import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import { YEAR_STORAGE_KEY } from "../../constants";
import type { GdpHappinessRow } from "../../data/csvData";
import UtilityCurve from ".";

vi.mock("katex", () => ({ default: { render: vi.fn() } }));
vi.mock("katex/dist/katex.min.css", () => ({}));

const rows = [
  { country: "Finland", year: 2014, gdpPerCapita: 40000, lifeLadder: 7.4 },
  {
    country: "United States",
    year: 2014,
    gdpPerCapita: 55000,
    lifeLadder: 7.1,
  },
  { country: "Kenya", year: 2014, gdpPerCapita: 1800, lifeLadder: 4.6 },
  { country: "Finland", year: 2015, gdpPerCapita: 41000, lifeLadder: 7.5 },
  {
    country: "United States",
    year: 2015,
    gdpPerCapita: 56000,
    lifeLadder: 7.0,
  },
  { country: "Kenya", year: 2015, gdpPerCapita: 1900, lifeLadder: 4.7 },
] as unknown as GdpHappinessRow[];

beforeEach(() => {
  writeMemoryItem(YEAR_STORAGE_KEY, 2014);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  SVGSVGElement.prototype.getScreenCTM = vi
    .fn()
    .mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("UtilityCurve", () => {
  it("renders a marker on the curve and a scrubber at the base", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    expect(document.querySelector('circle[fill="#ff8f34"]')).not.toBeNull();
    expect(document.querySelector('circle[fill="#555555"]')).not.toBeNull();
  });

  it("renders a background scatter point for every country in the selected (earliest) year only", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const scatterPoints = document.querySelectorAll('circle[fill="#bbbbbb"]');
    expect(scatterPoints).toHaveLength(3);
  });

  it("dims every background scatter point uniformly, with no country singled out", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const points = document.querySelectorAll('circle[fill="#bbbbbb"]');
    const opacities = new Set(
      Array.from(points).map((p) => p.getAttribute("opacity")),
    );
    expect(opacities).toEqual(new Set(["0.4"]));
  });

  it("moves every background scatter point when the year slider changes", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const before = Array.from(
      document.querySelectorAll('circle[fill="#bbbbbb"]'),
    ).map((p) => p.getAttribute("cx"));

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "2015" },
    });

    const after = Array.from(
      document.querySelectorAll('circle[fill="#bbbbbb"]'),
    ).map((p) => p.getAttribute("cx"));
    expect(after).not.toEqual(before);
    expect(document.querySelectorAll('circle[fill="#bbbbbb"]')).toHaveLength(3);
  });

  it("does not show the tangent line by default", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    expect(document.querySelector('line[stroke="#ff3c23"]')).toBeNull();
  });

  it("shows the tangent line after toggling it on", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    fireEvent.click(screen.getByRole("button", { name: /Tangent/ }));
    expect(document.querySelector('line[stroke="#ff3c23"]')).not.toBeNull();
  });

  it("moves the marker and the tangent line when the scrubber is dragged", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    fireEvent.click(screen.getByRole("button", { name: /Tangent/ }));

    const scrubber = document.querySelector('circle[fill="#555555"]');
    if (!scrubber) throw new Error("scrubber not found");
    const markerBefore = document.querySelector('circle[fill="#ff8f34"]');
    const cxBefore = markerBefore?.getAttribute("cx");
    const lineBefore = document.querySelector('line[stroke="#ff3c23"]');
    const y1Before = lineBefore?.getAttribute("y1");

    fireEvent.pointerDown(scrubber, {
      clientX: 300,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerMove(scrubber, {
      clientX: 450,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerUp(scrubber, { pointerId: 1 });

    const markerAfter = document.querySelector('circle[fill="#ff8f34"]');
    const lineAfter = document.querySelector('line[stroke="#ff3c23"]');
    expect(markerAfter?.getAttribute("cx")).not.toBe(cxBefore);
    expect(lineAfter?.getAttribute("y1")).not.toBe(y1Before);
  });

  it("keeps the marker and tangent line finite when the scrubber is dragged to the far left (regression: income near 0 broke Math.log)", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    fireEvent.click(screen.getByRole("button", { name: /Tangent/ }));

    const scrubber = document.querySelector('circle[fill="#555555"]');
    if (!scrubber) throw new Error("scrubber not found");

    fireEvent.pointerDown(scrubber, {
      clientX: 0,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerMove(scrubber, {
      clientX: 0,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerUp(scrubber, { pointerId: 1 });

    const marker = document.querySelector('circle[fill="#ff8f34"]');
    const line = document.querySelector('line[stroke="#ff3c23"]');
    for (const value of [
      marker?.getAttribute("cx"),
      marker?.getAttribute("cy"),
      line?.getAttribute("y1"),
      line?.getAttribute("y2"),
    ]) {
      expect(value).not.toBeNull();
      expect(Number.isFinite(Number(value))).toBe(true);
    }
  });

  it("does not render the regression equation by default", async () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;
    expect(renderSpy).not.toHaveBeenCalled();
  });

  it("renders the regression equation and R^2 via katex after toggling it on", async () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;

    fireEvent.click(screen.getByRole("button", { name: /Equation/ }));

    expect(renderSpy).toHaveBeenCalled();
    const [str] = renderSpy.mock.calls[renderSpy.mock.calls.length - 1];
    expect(str).toMatch(/\\ln\(x\)/);
    expect(str).toMatch(/R\^2 =/);
  });

  it("recomputes the regression equation when the year slider changes", async () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const katexMod = await import("katex");
    const renderSpy = katexMod.default.render as ReturnType<typeof vi.fn>;

    fireEvent.click(screen.getByRole("button", { name: /Equation/ }));
    const [before] = renderSpy.mock.calls[renderSpy.mock.calls.length - 1];

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "2015" },
    });

    const [after] = renderSpy.mock.calls[renderSpy.mock.calls.length - 1];
    expect(after).not.toBe(before);
  });

  it("shows a tooltip on focus and hides it on blur", () => {
    render(<UtilityCurve gdpHappinessByCountryYear={rows} />);
    const marker = screen.getByRole("button", { name: /Life Ladder/ });

    fireEvent.focus(marker);
    expect(document.querySelector(".fixed.z-50")).toHaveTextContent(
      "Life ladder score:",
    );

    fireEvent.blur(marker);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });
});
