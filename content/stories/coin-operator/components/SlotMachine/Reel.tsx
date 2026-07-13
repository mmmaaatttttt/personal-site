import type { FC } from "react";
import { cn } from "@/lib/utils";
import { type SlotValue, SYMBOL_EMOJI } from "../../data";

const EMPTY_REEL_GLYPH = "❔";

interface ReelProps {
  value: SlotValue | null;
  /** True while this reel is still cycling through symbols. */
  active?: boolean;
  className?: string;
}

const Reel: FC<ReelProps> = ({ value, active = false, className }) => {
  return (
    <div
      className={cn("rounded-md bg-neutral-800 p-1 shadow-inner", className)}
    >
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-sm border-2 border-neutral-900/40 bg-gradient-to-b from-white to-neutral-200 text-4xl shadow-inner sm:h-28 sm:w-28 sm:text-6xl",
          active && "animate-pulse",
        )}
      >
        {value ? SYMBOL_EMOJI[value] : EMPTY_REEL_GLYPH}
      </div>
    </div>
  );
};

export default Reel;
