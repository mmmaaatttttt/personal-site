import { describe, expect, it } from "vitest";
import type { WeddingData } from "../types";
import { selectOptions } from "./four-weddings-config";

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

      const accessor = budgetPerGuestOption?.accessor;
      expect(accessor(mockData[0] as WeddingData)).toBe(100);
      expect(accessor(mockData[1] as WeddingData)).toBe(100);
      expect(accessor(mockData[2] as WeddingData)).toBeNull();
    });

    it("calculates age gap correctly handling nulls", () => {
      const ageGapOption = selectOptions.histogram.find(
        (opt) => opt.value === "ageGap",
      );
      const accessor = ageGapOption?.accessor;

      const validEntry = { age: 25, spouseAge: 30 } as WeddingData;
      const invalidEntry = { age: 25, spouseAge: null } as WeddingData;

      expect(accessor(validEntry)).toBe(5);
      expect(accessor(invalidEntry)).toBeNull();
    });
  });

  describe("Pie chart helper logic", () => {
    it("tallies rankings correctly while ignoring nulls", () => {
      const pieOption = selectOptions.pie.find((opt) => opt.value === "budget");
      const accessor = pieOption?.accessor;

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
  });
});
