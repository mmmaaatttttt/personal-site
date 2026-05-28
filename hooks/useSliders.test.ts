import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useSliders from "./useSliders";

describe("useSliders", () => {
  const initialData = [
    { initialValue: 50, min: 0, max: 100, title: "Slider 1", color: "#ff0000" },
    {
      initialValue: 20,
      min: 10,
      max: 30,
      title: (val: number) => `Val: ${val}`,
      color: "#00ff00",
    },
  ];

  it("returns initial values", () => {
    const { result } = renderHook(() => useSliders(initialData));
    expect(result.current.values).toEqual([50, 20]);
  });

  it("enriches sliderData with current values and handlers", () => {
    const { result } = renderHook(() => useSliders(initialData));
    expect(result.current.sliderData[0].value).toBe(50);
    expect(result.current.sliderData[1].value).toBe(20);
    expect(typeof result.current.sliderData[0].handleValueChange).toBe(
      "function",
    );
  });

  it("updates a value when handleValueChange is called", () => {
    const { result } = renderHook(() => useSliders(initialData));
    act(() => {
      result.current.sliderData[0].handleValueChange(75);
    });
    expect(result.current.values).toEqual([75, 20]);
  });

  it("updating one slider does not affect others", () => {
    const { result } = renderHook(() => useSliders(initialData));
    act(() => {
      result.current.sliderData[1].handleValueChange(25);
    });
    expect(result.current.values).toEqual([50, 25]);
  });

  it("returns empty arrays for empty initialData", () => {
    const { result } = renderHook(() => useSliders([]));
    expect(result.current.values).toEqual([]);
    expect(result.current.sliderData).toEqual([]);
  });
});
