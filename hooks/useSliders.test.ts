import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import useSliders from "./useSliders";

const STORAGE_KEY_A = "test-slider-a";
const STORAGE_KEY_B = "test-slider-b";

beforeEach(() => {
  localStorage.clear();
});

describe("useSliders — local state (no storageKey)", () => {
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

describe("useSliders — storageKey", () => {
  const initialData = [
    {
      initialValue: 0.5,
      min: 0,
      max: 1,
      title: "A",
      color: "#f00",
      storageKey: STORAGE_KEY_A,
    },
    {
      initialValue: 0.3,
      min: 0,
      max: 1,
      title: "B",
      color: "#0f0",
      storageKey: STORAGE_KEY_B,
    },
  ];

  it("falls back to initialValue when localStorage is empty", () => {
    const { result } = renderHook(() => useSliders(initialData));
    expect(result.current.values).toEqual([0.5, 0.3]);
  });

  it("falls back to initialValue when no value has been set", () => {
    const { result } = renderHook(() => useSliders(initialData));
    expect(result.current.values[0]).toBe(0.5);
    expect(result.current.values[1]).toBe(0.3);
  });

  it("reflects an updated value after handleValueChange is called", () => {
    const { result } = renderHook(() => useSliders(initialData));
    act(() => {
      result.current.sliderData[0].handleValueChange(0.7);
    });
    expect(result.current.values[0]).toBe(0.7);
  });

  it("syncs a storage-backed value to a second hook instance", () => {
    const { result: a } = renderHook(() => useSliders(initialData));
    const { result: b } = renderHook(() => useSliders(initialData));

    act(() => {
      a.current.sliderData[0].handleValueChange(0.9);
    });

    expect(b.current.values[0]).toBe(0.9);
  });

  it("does not affect non-storage sliders in other instances", () => {
    const localData = [
      { initialValue: 10, min: 0, max: 100, title: "Local", color: "#00f" },
    ];
    const { result: stored } = renderHook(() => useSliders(initialData));
    const { result: local } = renderHook(() => useSliders(localData));

    act(() => {
      stored.current.sliderData[0].handleValueChange(0.9);
    });

    expect(local.current.values[0]).toBe(10);
  });

  it("mixed config: storage slider syncs, local slider stays independent", () => {
    const mixed = [
      {
        initialValue: 0.5,
        min: 0,
        max: 1,
        title: "Stored",
        color: "#f00",
        storageKey: STORAGE_KEY_A,
      },
      { initialValue: 7, min: 1, max: 20, title: "Local", color: "#00f" },
    ];
    const { result: h1 } = renderHook(() => useSliders(mixed));
    const { result: h2 } = renderHook(() => useSliders(mixed));

    act(() => {
      h1.current.sliderData[0].handleValueChange(0.8);
    });
    expect(h2.current.values[0]).toBe(0.8);

    act(() => {
      h1.current.sliderData[1].handleValueChange(15);
    });
    expect(h1.current.values[1]).toBe(15);
    expect(h2.current.values[1]).toBe(7);
  });
});

describe("useSliders — SSR", () => {
  it("server snapshot returns initial values during renderToString", () => {
    const config = [
      {
        initialValue: 0.5,
        min: 0,
        max: 1,
        title: "A",
        color: "#f00",
        storageKey: "ssr-slider-key",
      },
    ];
    function Comp() {
      const { values } = useSliders(config);
      return createElement("span", null, String(values[0]));
    }
    const html = renderToString(createElement(Comp));
    expect(html).toContain("0.5");
  });
});
