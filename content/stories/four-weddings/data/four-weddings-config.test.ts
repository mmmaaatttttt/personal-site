import { describe, expect, it } from "vitest";
import type { MapProperties, WeddingData } from "../types";
import {
  graphOptions,
  selectOptions,
  tooltipHelpers,
} from "./four-weddings-config";

const makeWedding = (overrides: Partial<WeddingData> = {}): WeddingData => ({
  season: 1,
  episode: 1,
  title: "Wedding",
  date: "2020-01-01",
  name: "Alex",
  age: 25,
  spouseName: "Sam",
  spouseAge: 27,
  guests: 100,
  budget: 20000,
  description: "",
  state: "CA",
  scoresGiven: [1, 2, 3],
  scoresReceived: { dress: 8, venue: 7, food: 9, experience: 10 },
  ranking: 1,
  expGivenRanking: 1,
  expDiffRanking: 1,
  expReceivedRanking: 1,
  budgetRanking: 1,
  budgetPerGuestRanking: 1,
  ...overrides,
});

const getOption = <T extends { value: string }>(
  options: T[],
  value: string,
) => {
  const option = options.find((o) => o.value === value);
  if (!option) throw new Error(`missing option ${value}`);
  return option;
};

describe("four-weddings-config logic", () => {
  const mockData: Partial<WeddingData>[] = [
    { budget: 10000, guests: 100, budgetRanking: 1, ranking: 1 },
    { budget: 20000, guests: 200, budgetRanking: 2, ranking: 1 },
    { budget: null, guests: null, budgetRanking: null, ranking: 1 }, // Null case
  ];

  describe("Histogram accessors", () => {
    it("calculates budget per guest correctly", () => {
      const budgetPerGuestOption = selectOptions.histogram.find(
        (opt) => opt.value === "budgetPerGuest",
      );
      expect(budgetPerGuestOption).toBeDefined();

      const { accessor } = budgetPerGuestOption as NonNullable<
        typeof budgetPerGuestOption
      >;
      expect(accessor(mockData[0] as WeddingData)).toBe(100);
      expect(accessor(mockData[1] as WeddingData)).toBe(100);
      expect(accessor(mockData[2] as WeddingData)).toBeNull();
    });

    it("calculates age gap correctly handling nulls", () => {
      const ageGapOption = selectOptions.histogram.find(
        (opt) => opt.value === "ageGap",
      );
      const { accessor } = ageGapOption as NonNullable<typeof ageGapOption>;

      const validEntry = { age: 25, spouseAge: 30 } as WeddingData;
      const invalidEntry = { age: 25, spouseAge: null } as WeddingData;

      expect(accessor(validEntry)).toBe(5);
      expect(accessor(invalidEntry)).toBeNull();
    });
  });

  describe("Pie chart helper logic", () => {
    it("tallies rankings correctly while ignoring nulls", () => {
      const pieOption = selectOptions.pie.find((opt) => opt.value === "budget");
      const { accessor } = pieOption as NonNullable<typeof pieOption>;

      const dataForPie: WeddingData[] = [
        { ranking: 1, budgetRanking: 1 } as WeddingData,
        { ranking: 1, budgetRanking: 1 } as WeddingData,
        { ranking: 1, budgetRanking: 2 } as WeddingData,
        { ranking: 1, budgetRanking: null } as WeddingData, // Should be ignored
        { ranking: 2, budgetRanking: 1 } as WeddingData, // Should be ignored (only rank 1 brides are tallied)
      ];

      const result = accessor(dataForPie);
      // Expected result: [rank1 count, rank2 count, rank3 count, rank4 count]
      // Rank 1 count: 2
      // Rank 2 count: 1
      expect(result).toEqual([2, 1, 0, 0]);
    });

    it.each([
      ["budgetPerGuest", "budgetPerGuestRanking"],
      ["expGiven", "expGivenRanking"],
      ["expReceived", "expReceivedRanking"],
      ["expDiff", "expDiffRanking"],
    ] as const)("%s tallies rank-1 brides by %s", (value, rankKey) => {
      const { accessor } = getOption(selectOptions.pie, value);
      const data = [
        makeWedding({ ranking: 1, [rankKey]: 3 }),
        makeWedding({ ranking: 1, [rankKey]: 3 }),
      ];
      expect(accessor(data)).toEqual([0, 0, 2, 0]);
    });
  });

  describe("remaining histogram accessors", () => {
    it.each(["budget", "guests", "age", "spouseAge"] as const)(
      "%s passes through the field directly",
      (value) => {
        const { accessor } = getOption(selectOptions.histogram, value);
        const wedding = makeWedding({ [value]: 42 });
        expect(accessor(wedding)).toBe(42);
      },
    );
  });

  describe("Map accessors", () => {
    it("counts weddings for a state", () => {
      const { accessor } = getOption(selectOptions.map, "weddingCount");
      const properties: MapProperties = {
        name: "California",
        values: [makeWedding(), makeWedding()],
      };
      expect(accessor(properties)).toBe(2);
    });

    it("falls back to 0 when a state has no weddings", () => {
      const { accessor } = getOption(selectOptions.map, "weddingCount");
      const properties: MapProperties = { name: "Empty", values: [] };
      expect(accessor(properties)).toBe(0);
    });

    it("averages the budget across a state's weddings", () => {
      const { accessor } = getOption(selectOptions.map, "avgBudget");
      const properties: MapProperties = {
        name: "California",
        values: [
          makeWedding({ budget: 10000 }),
          makeWedding({ budget: null }),
          makeWedding({ budget: 30000 }),
        ],
      };
      expect(accessor(properties)).toBe((10000 + 0 + 30000) / 3);
    });

    it("returns 0 average when a state has no weddings", () => {
      const { accessor } = getOption(selectOptions.map, "avgBudget");
      const properties: MapProperties = { name: "Empty", values: [] };
      expect(accessor(properties)).toBe(0);
    });
  });

  describe("Scatter accessors", () => {
    const wedding = makeWedding({
      budget: 15000,
      guests: 150,
      age: 28,
      spouseAge: 32,
      scoresGiven: [1, 2, 3],
      scoresReceived: { dress: 4, venue: 5, food: 6, experience: 7 },
    });

    it.each([
      ["budget", 15000],
      ["guestCount", 150],
      ["budgetPerGuest", 100],
      ["brideAge", 28],
      ["spouseAge", 32],
      ["ageGap", 4],
      ["totalPoints", 4 + 5 + 6 + 7],
      ["expPointsReceived", 7],
      ["expPointsGiven", 1 + 2 + 3],
      ["expPointsGap", 7 - (1 + 2 + 3)],
      ["dressScore", 4],
      ["foodScore", 6],
      ["venueScore", 5],
    ] as const)("%s computes the expected value", (value, expected) => {
      const { accessor } = getOption(selectOptions.scatter, value);
      expect(accessor(wedding)).toBe(expected);
    });

    it("nulls budgetPerGuest when guests or budget is missing", () => {
      const { accessor } = getOption(selectOptions.scatter, "budgetPerGuest");
      expect(accessor(makeWedding({ guests: null }))).toBeNull();
    });

    it("nulls ageGap when spouseAge or age is missing", () => {
      const { accessor } = getOption(selectOptions.scatter, "ageGap");
      expect(accessor(makeWedding({ spouseAge: null }))).toBeNull();
    });
  });

  describe("map tooltip helpers", () => {
    it("titles the tooltip with the state name", () => {
      expect(tooltipHelpers.map.title({ name: "Texas", values: [] })).toBe(
        "Texas",
      );
    });

    it("falls back to an empty title when the state has no name", () => {
      expect(tooltipHelpers.map.title({ name: "", values: [] })).toBe("");
    });

    it("bodies the tooltip with wedding count and average budget, treating null budgets as 0", () => {
      const body = tooltipHelpers.map.body({
        name: "Texas",
        values: [
          makeWedding({ budget: 10000 }),
          makeWedding({ budget: null }),
          makeWedding({ budget: 30000 }),
        ],
      });
      expect(body).toEqual([
        "Number of weddings: 3",
        "Average Budget: $13,333",
      ]);
    });

    it("reports no weddings for an empty state", () => {
      expect(tooltipHelpers.map.body({ name: "Empty", values: [] })).toBe(
        "No weddings for this state.",
      );
    });
  });

  describe("scatter color scale", () => {
    it.each([
      [1, "#3182bd"],
      [2, "#31a354"],
      [3, "#e6550d"],
      [4, "#d62728"],
      [null, "#ccc"],
    ])("ranking %s maps to %s", (ranking, color) => {
      expect(graphOptions.scatter.colorScale(ranking)).toBe(color);
    });
  });
});
