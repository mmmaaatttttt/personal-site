"use client";

import {
  ArrowDownAZ,
  ArrowDownZA,
  Bubbles,
  CalendarArrowDown,
  CalendarArrowUp,
  type LucideIcon,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import type { StoryView } from "./utils";

interface ViewOption {
  view: StoryView;
  icon: LucideIcon;
  reversedIcon: LucideIcon;
  label: string;
  reversedLabel: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    view: "date",
    icon: CalendarArrowDown,
    reversedIcon: CalendarArrowUp,
    label: "Newest first",
    reversedLabel: "Oldest first",
  },
  {
    view: "title",
    icon: ArrowDownAZ,
    reversedIcon: ArrowDownZA,
    label: "A to Z",
    reversedLabel: "Z to A",
  },
  {
    view: "similarity",
    icon: Bubbles,
    reversedIcon: Bubbles,
    label: "Similarity",
    reversedLabel: "Similarity",
  },
];

interface StoryViewControlsProps {
  view: StoryView;
  reversed: boolean;
  onSelect?: (view: StoryView) => void;
}

const StoryViewControls: FC<StoryViewControlsProps> = ({
  view,
  reversed,
  onSelect,
}) => (
  <div className="mb-6 flex justify-center gap-2 font-sans text-sm">
    {VIEW_OPTIONS.map((option) => {
      const selected = view === option.view;
      const flipped = selected && reversed;
      const Icon = flipped ? option.reversedIcon : option.icon;
      const label = flipped ? option.reversedLabel : option.label;
      return (
        <button
          key={option.view}
          type="button"
          aria-label={label}
          aria-pressed={selected}
          onClick={() => onSelect?.(option.view)}
          className={cn(
            "group relative rounded-md border border-gray p-2 transition-colors",
            selected
              ? "border-dark-gray bg-dark-gray text-white"
              : "hover:bg-light-gray",
          )}
        >
          <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-dark-gray px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {label}
          </span>
        </button>
      );
    })}
  </div>
);

export default StoryViewControls;
