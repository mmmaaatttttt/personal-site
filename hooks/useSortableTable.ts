"use client";

import { useMemo, useState } from "react";

export interface SortableTableResult<T> {
  sorted: T[];
  sortKey: keyof T & string;
  ascending: boolean;
  handleSortClick: (key: keyof T & string) => void;
}

export default function useSortableTable<T>(
  data: T[],
  initialSortKey: keyof T & string,
  initialAscending = true,
): SortableTableResult<T> {
  type SortKey = keyof T & string;
  const [sortKey, setSortKey] = useState<SortKey>(initialSortKey);
  const [ascending, setAscending] = useState(initialAscending);

  const handleSortClick = (key: SortKey) => {
    if (key === sortKey) {
      setAscending((prev) => !prev);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  const sorted = useMemo(() => {
    const dir = ascending ? 1 : -1;
    return [...data].sort((a, b) => {
      const v1 = a[sortKey];
      const v2 = b[sortKey];
      if (v1 > v2) return dir;
      if (v1 < v2) return -dir;
      return 0;
    });
  }, [data, sortKey, ascending]);

  return { sorted, sortKey, ascending, handleSortClick };
}
