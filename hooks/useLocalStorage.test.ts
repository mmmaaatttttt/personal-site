import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  readStoredItem,
  subscribeToKey,
  useLocalStorage,
  writeStoredItem,
} from "./useLocalStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  it("returns defaultValue when key is absent", () => {
    const { result } = renderHook(() => useLocalStorage("missing", 42));
    expect(result.current[0]).toBe(42);
  });

  it("reads an existing value from localStorage on mount", () => {
    localStorage.setItem("my-key", JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage("my-key", 0));
    expect(result.current[0]).toBe(99);
  });

  it("writes a new value and reflects it immediately", () => {
    const { result } = renderHook(() => useLocalStorage("k", 1));
    act(() => {
      result.current[1](7);
    });
    expect(result.current[0]).toBe(7);
    expect(JSON.parse(localStorage.getItem("k") ?? "null")).toBe(7);
  });

  it("supports functional updater form", () => {
    const { result } = renderHook(() => useLocalStorage("k", 10));
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
});

describe("readStoredItem", () => {
  it("returns fallback when key is absent", () => {
    expect(readStoredItem("nope", 123)).toBe(123);
  });

  it("returns the stored value when key exists", () => {
    localStorage.setItem("x", JSON.stringify(7));
    expect(readStoredItem("x", 0)).toBe(7);
  });

  it("returns fallback when stored value is invalid JSON", () => {
    localStorage.setItem("x", "???");
    expect(readStoredItem("x", 99)).toBe(99);
  });
});

describe("writeStoredItem", () => {
  it("writes the value to localStorage", () => {
    writeStoredItem("w", 42);
    expect(JSON.parse(localStorage.getItem("w") ?? "null")).toBe(42);
  });

  it("notifies subscribers on the same key", () => {
    let calls = 0;
    const unsub = subscribeToKey("w", () => {
      calls++;
    });
    writeStoredItem("w", 1);
    expect(calls).toBe(1);
    unsub();
  });

  it("does not notify subscribers on a different key", () => {
    let calls = 0;
    const unsub = subscribeToKey("other", () => {
      calls++;
    });
    writeStoredItem("w", 1);
    expect(calls).toBe(0);
    unsub();
  });
});

describe("subscribeToKey", () => {
  it("calls the callback when notified via writeStoredItem", () => {
    let calls = 0;
    const unsub = subscribeToKey("sub-key", () => {
      calls++;
    });
    writeStoredItem("sub-key", 1);
    writeStoredItem("sub-key", 2);
    expect(calls).toBe(2);
    unsub();
  });

  it("stops calling the callback after unsubscribe", () => {
    let calls = 0;
    const unsub = subscribeToKey("sub-key", () => {
      calls++;
    });
    writeStoredItem("sub-key", 1);
    unsub();
    writeStoredItem("sub-key", 2);
    expect(calls).toBe(1);
  });
});
