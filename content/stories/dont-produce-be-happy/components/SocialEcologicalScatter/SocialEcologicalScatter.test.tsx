import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import type { SocialShortfallRow } from "../../data/csvData";
import SocialEcologicalScatter from ".";

const rows: SocialShortfallRow[] = [
  {
    country: "Austria",
    region: "Europe",
    socialThresholdsAchieved: 11,
    biophysicalBoundariesTransgressed: 6,
    gdpPerCapita: 43915.23,
  },
  {
    country: "Brazil",
    region: "South America",
    socialThresholdsAchieved: 6,
    biophysicalBoundariesTransgressed: 5,
    gdpPerCapita: 8814.02,
  },
  {
    country: "Malawi",
    region: "Africa",
    socialThresholdsAchieved: 1,
    biophysicalBoundariesTransgressed: 0,
    gdpPerCapita: 539.61,
  },
];

describe("SocialEcologicalScatter", () => {
  it("renders one point per country", () => {
    render(<SocialEcologicalScatter socialShortfallByCountry={rows} />);
    expect(document.querySelectorAll("circle")).toHaveLength(rows.length);
  });

  it("renders a legend entry for each region", () => {
    render(<SocialEcologicalScatter socialShortfallByCountry={rows} />);
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("South America")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  it("shows a tooltip on focus and hides it on blur", () => {
    render(<SocialEcologicalScatter socialShortfallByCountry={rows} />);
    const point = screen.getByRole("button", { name: /Austria/ });

    fireEvent.focus(point);
    const tooltip = document.querySelector(".fixed.z-50");
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveTextContent("Austria");
    expect(tooltip).toHaveTextContent("11 of 11 social thresholds achieved");

    fireEvent.blur(point);
    expect(document.querySelector(".fixed.z-50")).toBeNull();
  });

  it("keeps every bubble within the padded chart bounds", () => {
    const { container } = render(
      <SocialEcologicalScatter socialShortfallByCountry={rows} />,
    );
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

  it("keeps a large, high-GDP collision group sitting right at the edge within bounds", () => {
    const edgeRows: SocialShortfallRow[] = [
      "Australia",
      "Denmark",
      "Finland",
      "Norway",
      "Sweden",
      "Switzerland",
      "United States",
    ].map((country) => ({
      country,
      region: "Europe",
      socialThresholdsAchieved: 10,
      biophysicalBoundariesTransgressed: 6,
      gdpPerCapita: 80000,
    }));

    const { container } = render(
      <SocialEcologicalScatter socialShortfallByCountry={edgeRows} />,
    );
    const svg = container.querySelector("svg");
    const width = Number(svg?.getAttribute("viewBox")?.split(" ")[2]);

    const circles = document.querySelectorAll("circle");
    expect(circles).toHaveLength(7);
    circles.forEach((circle) => {
      const cx = Number(circle.getAttribute("cx"));
      const r = Number(circle.getAttribute("r"));
      expect(cx - r).toBeGreaterThanOrEqual(0);
      expect(cx + r).toBeLessThanOrEqual(width);
    });
  });
});
