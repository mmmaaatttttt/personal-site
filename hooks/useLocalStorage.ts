"use client";

import { useCallback, useSyncExternalStore } from "react";

// Module-level pub/sub so same-window writes trigger re-renders.
// The native `storage` event only fires in *other* tabs.
const subscribers = new Map<string, Set<() => void>>();

function notifyKey(key: string) {
  subscribers.get(key)?.forEach((cb) => {
    cb();
  });
}

// Cache parsed values by raw string so getSnapshot returns a stable reference
// when the stored value hasn't changed. useSyncExternalStore uses Object.is to
// detect changes — JSON.parse always returns a new object, which would cause an
// infinite re-render loop for non-primitive stored values.
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function readItem<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  try {
    const value = raw !== null ? (JSON.parse(raw) as T) : fallback;
    snapshotCache.set(key, { raw, value });
    return value;
  } catch {
    snapshotCache.set(key, { raw, value: fallback });
    return fallback;
  }
}

export function subscribeToKey(key: string, callback: () => void): () => void {
  if (!subscribers.has(key)) subscribers.set(key, new Set());
  subscribers.get(key)?.add(callback);
  return () => {
    subscribers.get(key)?.delete(callback);
  };
}

export function readStoredItem<T>(key: string, fallback: T): T {
  return readItem(key, fallback);
}

export function writeStoredItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  notifyKey(key);
}

/**
 * SSR-safe localStorage hook backed by useSyncExternalStore.
 * Reads the real value on the first client render (no flash of default).
 * Writes are synced to localStorage and trigger re-renders in the same tab.
 * Returns [value, set, remove] where remove deletes the key and resets to defaultValue.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!subscribers.has(key)) subscribers.set(key, new Set());
      subscribers.get(key)?.add(callback);
      return () => {
        subscribers.get(key)?.delete(callback);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(
    () => readItem(key, defaultValue),
    // defaultValue is intentionally omitted: callers pass a stable primitive.
    // Including it would cause infinite loops when callers pass object literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, defaultValue],
  );

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultValue,
  );

  const setValue = useCallback(
    (newVal: T | ((prev: T) => T)) => {
      const current = readItem(key, defaultValue);
      const next =
        typeof newVal === "function"
          ? (newVal as (prev: T) => T)(current)
          : newVal;
      localStorage.setItem(key, JSON.stringify(next));
      notifyKey(key);
    },
    // Same reasoning as getSnapshot: omit defaultValue from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, defaultValue],
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    notifyKey(key);
  }, [key]);

  return [value, setValue, remove];
}
