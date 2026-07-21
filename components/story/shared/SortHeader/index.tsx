"use client";

interface SortHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  currentKey: K;
  ascending: boolean;
  onClick: (key: K) => void;
}

const UpArrow = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true">
    <path d="M5 0 L10 8 L0 8 Z" fill="currentColor" />
  </svg>
);

const DownArrow = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true">
    <path d="M5 8 L10 0 L0 0 Z" fill="currentColor" />
  </svg>
);

const BothArrows = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
    <path d="M5 0 L10 5 L0 5 Z" fill="currentColor" />
    <path d="M5 14 L10 9 L0 9 Z" fill="currentColor" />
  </svg>
);

function sortIcon(isActive: boolean, ascending: boolean) {
  if (!isActive) return <BothArrows />;
  if (ascending) return <UpArrow />;
  return <DownArrow />;
}

export default function SortHeader<K extends string>({
  label,
  sortKey,
  currentKey,
  ascending,
  onClick,
}: SortHeaderProps<K>) {
  const isActive = sortKey === currentKey;

  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <button
        type="button"
        aria-label={`Sort by ${label}`}
        onClick={() => onClick(sortKey)}
        className={`inline-flex cursor-pointer items-center border-0 bg-transparent px-0.5 ${isActive ? "text-[#00802b]" : "text-[#555555]"}`}
      >
        {sortIcon(isActive, ascending)}
      </button>
    </span>
  );
}
