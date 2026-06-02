"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  readMemoryItem,
  subscribeToMemoryKey,
  writeMemoryItem,
} from "./useMemoryStore";

export interface SliderInitialData {
  initialValue: number;
  min: number;
  max: number;
  step?: number;
  title: string | ((val: number) => string);
  color: string;
  key?: string | number;
  tickCount?: number;
  storageKey?: string;
}

export interface SliderData extends SliderInitialData {
  value: number;
  handleValueChange: (val: number) => void;
}

export default function useSliders(initialData: SliderInitialData[]): {
  values: number[];
  sliderData: SliderData[];
} {
  // Identify which slider indices are backed by localStorage.
  // initialData is always a module-level const so this memo runs once.
  const storageEntries = useMemo(
    () =>
      initialData
        .map((d, i) =>
          d.storageKey
            ? { key: d.storageKey, idx: i, fallback: d.initialValue }
            : null,
        )
        .filter(
          (x): x is { key: string; idx: number; fallback: number } =>
            x !== null,
        ),
    [initialData],
  );

  const subscribeAll = useCallback(
    (callback: () => void) => {
      if (storageEntries.length === 0) return () => {};
      const unsubs = storageEntries.map(({ key }) =>
        subscribeToMemoryKey(key, callback),
      );
      return () => {
        for (const f of unsubs) f();
      };
    },
    [storageEntries],
  );

  // useSyncExternalStore requires getSnapshot to return the same reference
  // when values are unchanged — otherwise Object.is sees a new array every
  // call and triggers an infinite re-render loop.
  const cachedSnapshot = useRef<number[]>([]);

  const getStorageSnapshot = useCallback(() => {
    const next = storageEntries.map(({ key, fallback }) =>
      readMemoryItem(key, fallback),
    );
    const prev = cachedSnapshot.current;
    if (prev.length === next.length && next.every((v, i) => v === prev[i])) {
      return prev;
    }
    cachedSnapshot.current = next;
    return next;
  }, [storageEntries]);

  const getServerSnapshot = useCallback(
    () => storageEntries.map(({ fallback }) => fallback),
    [storageEntries],
  );

  const storedValues = useSyncExternalStore(
    subscribeAll,
    getStorageSnapshot,
    getServerSnapshot,
  );

  // Local state for non-storage sliders.
  const [localValues, setLocalValues] = useState<number[]>(() =>
    initialData.map((d) => d.initialValue),
  );

  // Merge: storage-backed indices override localValues at their positions.
  const values = useMemo(() => {
    const result = [...localValues];
    storageEntries.forEach(({ idx }, externalIdx) => {
      result[idx] = storedValues[externalIdx];
    });
    return result;
  }, [localValues, storedValues, storageEntries]);

  const handleValueChange = useCallback(
    (idx: number, newVal: number) => {
      const entry = storageEntries.find((e) => e.idx === idx);
      if (entry) {
        writeMemoryItem(entry.key, newVal);
      } else {
        setLocalValues((prev) => {
          const next = [...prev];
          next[idx] = newVal;
          return next;
        });
      }
    },
    [storageEntries],
  );

  const sliderData = useMemo(
    () =>
      initialData.map((d, i) => ({
        ...d,
        value: values[i],
        handleValueChange: (val: number) => handleValueChange(i, val),
      })),
    [initialData, values, handleValueChange],
  );

  return { values, sliderData };
}
