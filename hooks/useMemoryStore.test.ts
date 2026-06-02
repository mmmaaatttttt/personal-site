import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  readMemoryItem,
  subscribeToMemoryKey,
  useMemoryStore,
  writeMemoryItem,
} from "./useMemoryStore";

describe("readMemoryItem", () => {
  it("returns fallback when key has not been set", () => {
    expect(readMemoryItem("absent", 42)).toBe(42);
  });

  it("returns the value after writeMemoryItem", () => {
    writeMemoryItem("read-test", 99);
    expect(readMemoryItem("read-test", 0)).toBe(99);
  });
});

describe("writeMemoryItem", () => {
  it("persists the value so subsequent reads return it", () => {
    writeMemoryItem("write-test", "hello");
    expect(readMemoryItem("write-test", "")).toBe("hello");
  });

  it("notifies subscribers on the same key", () => {
    let calls = 0;
    const unsub = subscribeToMemoryKey("notify-test", () => {
      calls++;
    });
    writeMemoryItem("notify-test", 1);
    expect(calls).toBe(1);
    unsub();
  });

  it("does not notify subscribers on a different key", () => {
    let calls = 0;
    const unsub = subscribeToMemoryKey("other-key", () => {
      calls++;
    });
    writeMemoryItem("unrelated-key", 1);
    expect(calls).toBe(0);
    unsub();
  });
});

describe("subscribeToMemoryKey", () => {
  it("fires the callback each time the key is written", () => {
    let calls = 0;
    const unsub = subscribeToMemoryKey("sub-test", () => {
      calls++;
    });
    writeMemoryItem("sub-test", 1);
    writeMemoryItem("sub-test", 2);
    expect(calls).toBe(2);
    unsub();
  });

  it("stops firing after unsubscribe", () => {
    let calls = 0;
    const unsub = subscribeToMemoryKey("unsub-test", () => {
      calls++;
    });
    writeMemoryItem("unsub-test", 1);
    unsub();
    writeMemoryItem("unsub-test", 2);
    expect(calls).toBe(1);
  });
});

describe("useMemoryStore", () => {
  it("returns defaultValue when key has not been set", () => {
    const { result } = renderHook(() => useMemoryStore("hook-default", 7));
    expect(result.current[0]).toBe(7);
  });

  it("reflects a value set before mount", () => {
    writeMemoryItem("hook-pre-set", 55);
    const { result } = renderHook(() => useMemoryStore("hook-pre-set", 0));
    expect(result.current[0]).toBe(55);
  });

  it("updates when setValue is called", () => {
    const { result } = renderHook(() => useMemoryStore("hook-set", 0));
    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
  });

  it("syncs between two hook instances on the same key", () => {
    const { result: a } = renderHook(() => useMemoryStore("hook-sync", 0));
    const { result: b } = renderHook(() => useMemoryStore("hook-sync", 0));
    act(() => {
      a.current[1](99);
    });
    expect(b.current[0]).toBe(99);
  });

  it("does not sync between different keys", () => {
    const { result: a } = renderHook(() => useMemoryStore("hook-key-a", 0));
    const { result: b } = renderHook(() => useMemoryStore("hook-key-b", 0));
    act(() => {
      a.current[1](99);
    });
    expect(b.current[0]).toBe(0);
  });
});
