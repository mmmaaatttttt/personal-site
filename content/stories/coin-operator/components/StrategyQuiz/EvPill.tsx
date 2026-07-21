import type { FC } from "react";
import { cn } from "@/lib/utils";

export type EvPillVariant = "optimal" | "selected-wrong" | "neutral";

interface EvPillProps {
  value: number;
  variant: EvPillVariant;
}

const EvPill: FC<EvPillProps> = ({ value, variant }) => {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-mono text-xs shadow",
        variant === "optimal" && "bg-green-100 text-green-800",
        variant === "selected-wrong" && "bg-red-100 text-red-800",
        variant === "neutral" && "bg-white text-gray-600",
      )}
    >
      {value.toFixed(3)}
    </span>
  );
};

export default EvPill;
