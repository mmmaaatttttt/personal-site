"use client";

import { FC } from "react";

type SortKey = "state" | "averageSaturation" | "averageTurnout";

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  ascending: boolean;
  onClick: (key: SortKey) => void;
}

const SortHeader: FC<SortHeaderProps> = ({ label, sortKey, currentKey, ascending, onClick }) => {
  const isActive = sortKey === currentKey;
  const icon = isActive ? (ascending ? "▲" : "▼") : "⇅";

  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <button
        type="button"
        aria-label={`Sort by ${label}`}
        onClick={() => onClick(sortKey)}
        className={`cursor-pointer border-0 bg-transparent px-0.5 text-[0.85em] ${isActive ? "text-[#00802b]" : "text-[#555555]"}`}
      >
        {icon}
      </button>
    </span>
  );
};

export type { SortKey };
export default SortHeader;
