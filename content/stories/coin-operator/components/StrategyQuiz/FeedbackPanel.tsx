import type { FC } from "react";
import { cn } from "@/lib/utils";

interface FeedbackPanelProps {
  isCorrect: boolean;
  ev: number;
}

const FeedbackPanel: FC<FeedbackPanelProps> = ({ isCorrect, ev }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={cn(
          "text-3xl font-bold",
          isCorrect ? "text-green-600" : "text-red-600",
        )}
      >
        {isCorrect ? "✓" : "✗"}
      </span>
      <p className="max-w-md text-center text-gray-700 text-sm">
        The expected value of this move is {ev.toFixed(3)}. This is{" "}
        {isCorrect ? "" : "not"} the optimal move!
      </p>
    </div>
  );
};

export default FeedbackPanel;
