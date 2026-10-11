import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/utils/formatHelpers";
import type { GdpHappinessRow } from "../../data/csvData";
import { healthOutcomesByYear } from "../../data/csvData";
import RegionScatterPlotContainer from ".";

const gdpHappinessRows: GdpHappinessRow[] = [
  {
    country: "Finland",
    region: "Europe",
    year: 2014,
    gdpPerCapita: 50073.78,
    lifeLadder: 7.406,
  },
  {
    country: "United States",
    region: "North America",
    year: 2014,
    gdpPerCapita: 55153.39,
    lifeLadder: 7.119,
  },
  {
    country: "Kenya",
    region: "Africa",
    year: 2014,
    gdpPerCapita: 1800,
    lifeLadder: 4.6,
  },
  {
    country: "Finland",
    region: "Europe",
    year: 2015,
    gdpPerCapita: 42560.35,
    lifeLadder: 7.413,
  },
  {
    country: "United States",
    region: "North America",
    year: 2015,
    gdpPerCapita: 56849.47,
    lifeLadder: 7.104,
  },
  {
    country: "Kenya",
    region: "Africa",
    year: 2015,
    gdpPerCapita: 1900,
    lifeLadder: 4.7,
  },
];

const countriesPerHealthYear = healthOutcomesByYear.filter(
  (row) => row.year === 2023,
).length;

describe("RegionScatterPlotContainer (gdp-happiness variant)", () => {
  it("renders one point per country for the selected year", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    expect(document.querySelectorAll("circle")).toHaveLength(3);
  });

  it("renders a legend entry for each region", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("South America")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  it("colors points by region rather than a single uniform color", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    const us = screen.getByRole("button", { name: /United States/ });
    const kenya = screen.getByRole("button", { name: /Kenya/ });
    expect(us.getAttribute("fill")).not.toBe(kenya.getAttribute("fill"));
  });

  it("keeps the United States at full opacity while dimming every other country", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    const us = screen.getByRole("button", { name: /United States/ });
    const finland = screen.getByRole("button", { name: /Finland/ });

    expect(us.getAttribute("opacity")).toBe("1");
    expect(Number(finland.getAttribute("opacity"))).toBeLessThan(1);
  });

  it("shows a tooltip with the country name, GDP, and Life Ladder score on focus, and hides it on blur", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    const point = screen.getByRole("button", { name: /Finland/ });
    const expectedGdp = formatCurrency(50073.78);

    fireEvent.focus(point);
    const tooltip = document.querySelector(".fixed.z-50");
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveTextContent("Finland");
    expect(tooltip).toHaveTextContent(expectedGdp);
    expect(tooltip).toHaveTextContent("7.41");

    fireEvent.blur(point);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });

  it("moves every country's point when the year slider changes", () => {
    render(
      <RegionScatterPlotContainer
        variant="gdp-happiness"
        rows={gdpHappinessRows}
      />,
    );
    const before = screen
      .getByRole("button", { name: /United States/ })
      .getAttribute("cx");

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "2015" },
    });

    const after = screen
      .getByRole("button", { name: /United States/ })
      .getAttribute("cx");
    expect(after).not.toBe(before);
    expect(document.querySelectorAll("circle")).toHaveLength(3);
  });
});

describe("RegionScatterPlotContainer (health-spending variant)", () => {
  it("renders one point per country for the default (most recent) year", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    expect(document.querySelectorAll("circle")).toHaveLength(
      countriesPerHealthYear,
    );
  });

  it("exposes each point's country name and life expectancy via aria-label", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    expect(
      screen.getByRole("button", { name: /United States/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ethiopia/ }),
    ).toBeInTheDocument();
  });

  it("shows a tooltip with the country name, health spending, and life expectancy on focus, and hides it on blur", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    const point = screen.getByRole("button", { name: /Germany/ });
    const germany = healthOutcomesByYear.find(
      (row) => row.country === "Germany" && row.year === 2023,
    );
    const expectedSpending = formatCurrency(
      germany?.healthSpendingPerCapita ?? 0,
    );

    fireEvent.focus(point);
    const tooltip = document.querySelector(".fixed.z-50");
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveTextContent("Germany");
    expect(tooltip).toHaveTextContent(expectedSpending);
    expect(tooltip).toHaveTextContent(
      `${germany?.lifeExpectancy.toFixed(1)} years`,
    );

    fireEvent.blur(point);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });

  it("gives every point the same circle styling, US included", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    const us = screen.getByRole("button", { name: /United States/ });
    const germany = screen.getByRole("button", { name: /Germany/ });

    expect(us.getAttribute("r")).toBe(germany.getAttribute("r"));
    expect(us.getAttribute("stroke-width")).toBe(
      germany.getAttribute("stroke-width"),
    );
  });

  it("keeps the United States at full opacity while dimming every other point", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    const us = screen.getByRole("button", { name: /United States/ });
    const germany = screen.getByRole("button", { name: /Germany/ });

    expect(us.getAttribute("opacity")).toBe("1");
    expect(Number(germany.getAttribute("opacity"))).toBeLessThan(1);
  });

  it("updates the points when the year slider changes", () => {
    render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    const before = screen
      .getByRole("button", { name: /United States/ })
      .getAttribute("cx");

    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "2000" },
    });

    const after = screen
      .getByRole("button", { name: /United States/ })
      .getAttribute("cx");
    expect(after).not.toBe(before);
    expect(document.querySelectorAll("circle")).toHaveLength(
      countriesPerHealthYear,
    );
  });

  it("keeps every point within the padded chart bounds at an early year", () => {
    const { container } = render(
      <RegionScatterPlotContainer
        variant="health-spending"
        rows={healthOutcomesByYear}
      />,
    );
    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "2000" },
    });

    const svg = container.querySelector("svg");
    const width = Number(svg?.getAttribute("viewBox")?.split(" ")[2]);
    const height = Number(svg?.getAttribute("viewBox")?.split(" ")[3]);

    document.querySelectorAll("circle").forEach((circle) => {
      const cx = Number(circle.getAttribute("cx"));
      const cy = Number(circle.getAttribute("cy"));
      const r = Number(circle.getAttribute("r"));
      expect(cx - r).toBeGreaterThanOrEqual(0);
      expect(cx + r).toBeLessThanOrEqual(width);
      expect(cy - r).toBeGreaterThanOrEqual(0);
      expect(cy + r).toBeLessThanOrEqual(height);
    });
  });
});
