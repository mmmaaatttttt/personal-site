import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useSortableTable from "./useSortableTable";

interface Row {
  name: string;
  value: number;
}

const rows: Row[] = [
  { name: "Beta", value: 3 },
  { name: "Alpha", value: 1 },
  { name: "Gamma", value: 2 },
];

describe("useSortableTable", () => {
  it("sorts by the initial sort key ascending by default", () => {
    const { result } = renderHook(() => useSortableTable(rows, "value"));
    expect(result.current.sorted.map((r) => r.name)).toEqual([
      "Alpha",
      "Gamma",
      "Beta",
    ]);
    expect(result.current.sortKey).toBe("value");
    expect(result.current.ascending).toBe(true);
  });

  it("respects an explicit initialAscending value", () => {
    const { result } = renderHook(() => useSortableTable(rows, "value", false));
    expect(result.current.sorted.map((r) => r.name)).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ]);
  });

  it("switches sort key and resets to ascending when a new key is clicked", () => {
    const { result } = renderHook(() => useSortableTable(rows, "value", false));
    act(() => {
      result.current.handleSortClick("name");
    });
    expect(result.current.sortKey).toBe("name");
    expect(result.current.ascending).toBe(true);
    expect(result.current.sorted.map((r) => r.name)).toEqual([
      "Alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("toggles ascending when the same key is clicked again", () => {
    const { result } = renderHook(() => useSortableTable(rows, "value"));
    act(() => {
      result.current.handleSortClick("value");
    });
    expect(result.current.ascending).toBe(false);
    expect(result.current.sorted.map((r) => r.name)).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ]);
  });
});
