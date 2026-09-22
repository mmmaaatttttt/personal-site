import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/utils/formatHelpers";
import { healthOutcomesByYear } from "../../healthSpendingData";
import HealthSpendingScatter from ".";

const countriesPerYear = healthOutcomesByYear.filter(
  (row) => row.year === 2023,
).length;

describe("HealthSpendingScatter", () => {
  it("renders one point per country for the default (most recent) year", () => {
    render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
    );
    expect(document.querySelectorAll("circle")).toHaveLength(countriesPerYear);
  });

  it("exposes each point's country name and life expectancy via aria-label", () => {
    render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
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
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
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

  it("renders a legend entry for each region", () => {
    render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
    );
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("South America")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  it("gives every point the same circle styling, US included", () => {
    render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
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
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
    );
    const us = screen.getByRole("button", { name: /United States/ });
    const germany = screen.getByRole("button", { name: /Germany/ });

    expect(us.getAttribute("opacity")).toBe("1");
    expect(Number(germany.getAttribute("opacity"))).toBeLessThan(1);
  });

  it("updates the points when the year slider changes", () => {
    render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
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
    expect(document.querySelectorAll("circle")).toHaveLength(countriesPerYear);
  });

  it("keeps every point within the padded chart bounds at an early year", () => {
    const { container } = render(
      <HealthSpendingScatter healthOutcomesByYear={healthOutcomesByYear} />,
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
