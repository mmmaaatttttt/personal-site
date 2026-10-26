import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import COLORS from "@/utils/styles";
import { YEAR_STORAGE_KEY } from "./constants";
import useYearSlider from "./useYearSlider";

describe("useYearSlider", () => {
  beforeEach(() => {
    writeMemoryItem(YEAR_STORAGE_KEY, 2015);
  });

  it("uses the shared dark gray slider color", () => {
    const { result } = renderHook(() => useYearSlider(2014, 2025, 2014));
    expect(result.current.sliderData[0].color).toBe(COLORS.DARK_GRAY);
    expect(result.current.sliderData[0].title).toBeTypeOf("function");
  });

  it("shares the selected year between sliders", () => {
    const first = renderHook(() => useYearSlider(2000, 2023, 2023));
    const second = renderHook(() => useYearSlider(2014, 2025, 2014));

    act(() => {
      first.result.current.sliderData[0].handleValueChange(2020);
    });

    expect(first.result.current.year).toBe(2020);
    expect(second.result.current.year).toBe(2020);
  });

  it("clamps a shared year below the slider's range to its minimum", () => {
    writeMemoryItem(YEAR_STORAGE_KEY, 2005);
    const { result } = renderHook(() => useYearSlider(2014, 2025, 2014));
    expect(result.current.year).toBe(2014);
    expect(result.current.sliderData[0].value).toBe(2014);
  });

  it("clamps a shared year above the slider's range to its maximum", () => {
    writeMemoryItem(YEAR_STORAGE_KEY, 2025);
    const { result } = renderHook(() => useYearSlider(2000, 2023, 2023));
    expect(result.current.year).toBe(2023);
    expect(result.current.sliderData[0].value).toBe(2023);
  });
});
