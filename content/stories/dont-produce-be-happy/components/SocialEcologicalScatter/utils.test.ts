import { describe, expect, it } from "vitest";
import type { SocialShortfallRow } from "../../data/csvData";
import { deriveScatterData } from "./utils";

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

describe("deriveScatterData", () => {
  it("maps biophysical boundaries and social thresholds to x/y coordinates", () => {
    const [point] = deriveScatterData(rows);
    expect(point.cx).toBe(6);
    expect(point.cy).toBe(11);
    expect(point.key).toBe("Austria");
    expect(point.label).toBe("Austria");
  });

  it("scales the richest country in the data to the maximum radius", () => {
    const [point] = deriveScatterData(rows);
    expect(point.key).toBe("Austria");
    expect(point.radius).toBeCloseTo(20, 5);
  });

  it("scales the poorest country in the data to the minimum radius", () => {
    const points = deriveScatterData(rows);
    const malawi = points.find((point) => point.key === "Malawi");
    expect(malawi?.radius).toBeCloseTo(5, 5);
  });

  it("gives a country between the extremes a radius strictly between the min and max", () => {
    const points = deriveScatterData(rows);
    const brazil = points.find((point) => point.key === "Brazil");
    expect(brazil?.radius).toBeGreaterThan(5);
    expect(brazil?.radius).toBeLessThan(20);
  });

  it("scales radius by each country's share of the dataset's actual GDP range, not a fixed divisor", () => {
    const lowGdpRows: SocialShortfallRow[] = [
      {
        country: "Lao PDR",
        region: "Asia",
        socialThresholdsAchieved: 1,
        biophysicalBoundariesTransgressed: 4,
        gdpPerCapita: 2121.01,
      },
      {
        country: "Botswana",
        region: "Africa",
        socialThresholdsAchieved: 1,
        biophysicalBoundariesTransgressed: 4,
        gdpPerCapita: 6141.2,
      },
    ];
    const points = deriveScatterData(lowGdpRows);
    const lao = points.find((point) => point.key === "Lao PDR");
    const botswana = points.find((point) => point.key === "Botswana");
    expect(lao?.radius).not.toBeCloseTo(botswana?.radius ?? 0, 1);
  });

  it("colors points by region", () => {
    const [austria, brazil, malawi] = deriveScatterData(rows);
    expect(austria.fill).not.toBe(brazil.fill);
    expect(brazil.fill).not.toBe(malawi.fill);
  });

  it("darkens the fill color for the stroke rather than repeating it", () => {
    const [point] = deriveScatterData(rows);
    expect(point.stroke).not.toBe(point.fill);
  });

  it("builds an aria-label and tooltip body from the thresholds and GDP", () => {
    const [point] = deriveScatterData(rows);
    expect(point.ariaLabel).toBe(
      "Austria, 11 of 11 social thresholds achieved, 6 of 6 biophysical boundaries transgressed, $43,915 per capita",
    );
    expect(point.tooltipBody).toEqual([
      "11 of 11 social thresholds achieved",
      "6 of 6 biophysical boundaries transgressed",
      "$43,915 per capita",
    ]);
  });

  it("does not jitter a country whose point is unique", () => {
    const [point] = deriveScatterData(rows);
    expect(point.cx).toBe(6);
  });

  it("spreads countries that share the exact same point so every one is distinctly hoverable", () => {
    const collidingRows: SocialShortfallRow[] = [
      {
        country: "Ghana",
        region: "Africa",
        socialThresholdsAchieved: 1,
        biophysicalBoundariesTransgressed: 2,
        gdpPerCapita: 1722.77,
      },
      {
        country: "India",
        region: "Asia",
        socialThresholdsAchieved: 1,
        biophysicalBoundariesTransgressed: 2,
        gdpPerCapita: 1584.0,
      },
      {
        country: "Pakistan",
        region: "Asia",
        socialThresholdsAchieved: 1,
        biophysicalBoundariesTransgressed: 2,
        gdpPerCapita: 1434.0,
      },
    ];

    const points = deriveScatterData(collidingRows);
    const cxValues = points.map((point) => point.cx);
    expect(new Set(cxValues).size).toBe(3);
    // All still centered on the real shared count, just spread around it.
    for (const cx of cxValues) {
      expect(cx).toBeGreaterThan(1.5);
      expect(cx).toBeLessThan(2.5);
    }
    // Every country keeps its own correct y and tooltip content.
    for (const point of points) {
      expect(point.cy).toBe(1);
      expect(point.tooltipBody[0]).toBe("1 of 11 social thresholds achieved");
    }
  });

  it("sorts output with the largest circles first so small ones aren't hidden behind them", () => {
    const points = deriveScatterData(rows);
    const radii = points.map((point) => point.radius);
    expect(radii).toEqual([...radii].sort((first, second) => second - first));
  });
});
