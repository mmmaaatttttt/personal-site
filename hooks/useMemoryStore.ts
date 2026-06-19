"use client";

import { useCallback, useSyncExternalStore } from "react";

// Module-level state — resets on every page load, never touches localStorage.
const store = new Map<string, unknown>();
const subscribers = new Map<string, Set<() => void>>();

function notifyKey(key: string) {
  for (const cb of subscribers.get(key) ?? []) cb();
}

export function readMemoryItem<T>(key: string, fallback: T): T {
  return store.has(key) ? (store.get(key) as T) : fallback;
}

export function writeMemoryItem<T>(key: string, value: T): void {
  store.set(key, value);
  notifyKey(key);
}

export function subscribeToMemoryKey(
  key: string,
  callback: () => void,
): () => void {
  if (!subscribers.has(key)) subscribers.set(key, new Set());
  subscribers.get(key)?.add(callback);
  return () => {
    subscribers.get(key)?.delete(callback);
  };
}

export function useMemoryStore<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const subscribe = useCallback(
    (callback: () => void) => subscribeToMemoryKey(key, callback),
    [key],
  );

  // defaultValue intentionally omitted from deps — callers pass stable primitives.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const getSnapshot = useCallback(
    () => readMemoryItem(key, defaultValue),
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultValue,
  );

  const setValue = useCallback(
    (newVal: T) => writeMemoryItem(key, newVal),
    [key],
  );

  return [value, setValue];
}
