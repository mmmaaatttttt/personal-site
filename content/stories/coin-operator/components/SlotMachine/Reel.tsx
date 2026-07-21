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
          "flex h-12 w-12 items-center justify-center rounded-sm border-2 border-neutral-900/40 bg-gradient-to-b from-white to-neutral-200 text-xl shadow-inner sm:h-20 sm:w-20 sm:text-4xl lg:h-28 lg:w-28 lg:text-6xl",
          active && "animate-pulse",
        )}
      >
        {value ? SYMBOL_EMOJI[value] : EMPTY_REEL_GLYPH}
      </div>
    </div>
  );
};

export default Reel;
