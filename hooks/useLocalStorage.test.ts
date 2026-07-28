import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  it("returns defaultValue when key is not set", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 42));
    expect(result.current[0]).toBe(42);
  });

  it("returns stored value when key exists", () => {
    localStorage.setItem("test-key", JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage("test-key", 42));
    expect(result.current[0]).toBe(99);
  });

  it("sets a new value and re-renders", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));
    act(() => {
      result.current[1](7);
    });
    expect(result.current[0]).toBe(7);
    expect(JSON.parse(localStorage.getItem("test-key") as string)).toBe(7);
  });

  it("supports functional updater form", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 10));
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(15);
  });

  it("syncs between two hook instances on the same key", () => {
    const { result: a } = renderHook(() => useLocalStorage("shared", 0));
    const { result: b } = renderHook(() => useLocalStorage("shared", 0));
    act(() => {
      a.current[1](42);
    });
    expect(b.current[0]).toBe(42);
  });

  it("does not sync between different keys", () => {
    const { result: a } = renderHook(() => useLocalStorage("key-a", 0));
    const { result: b } = renderHook(() => useLocalStorage("key-b", 0));
    act(() => {
      a.current[1](99);
    });
    expect(b.current[0]).toBe(0);
  });

  it("remove resets to defaultValue and clears localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("k", 5));
    act(() => {
      result.current[1](20);
    });
    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem("k")).toBeNull();
  });

  it("handles invalid JSON in localStorage by falling back to default", () => {
    localStorage.setItem("bad", "not-json{{{");
    const { result } = renderHook(() => useLocalStorage("bad", 0));
    expect(result.current[0]).toBe(0);
  });
  it("removes the key and resets to default", () => {
    localStorage.setItem("test-key", JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage("test-key", 0));
    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(0);
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("returns fallback when stored value is invalid JSON", () => {
    localStorage.setItem("test-key", "not-valid-json{{{");
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("uses stable snapshot cache for same raw value", () => {
    localStorage.setItem("test-key", JSON.stringify({ a: 1 }));
    const { result, rerender } = renderHook(() =>
      useLocalStorage("test-key", { a: 0 }),
    );
    const first = result.current[0];
    rerender();
    expect(result.current[0]).toBe(first);
  });
});
