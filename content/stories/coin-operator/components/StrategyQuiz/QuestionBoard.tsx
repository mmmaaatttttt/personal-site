"use client";

import type { FC } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import { cn } from "@/lib/utils";
import type { ActionValues } from "../../bonusMath";
import type { SlotResult } from "../../data";
import Reel from "../SlotMachine/Reel";
import EvPill, { type EvPillVariant } from "./EvPill";
import { type QuizAction, valueForAction } from "./quizMath";

interface QuestionBoardProps {
  scenario: SlotResult;
  selectedIndex: number | null;
  disabled: boolean;
  onSelectSlot: (index: number) => void;
  actionValues: ActionValues | null;
  optimalAction: QuizAction | null;
}

const QuestionBoard: FC<QuestionBoardProps> = ({
  scenario,
  selectedIndex,
  disabled,
  onSelectSlot,
  actionValues,
  optimalAction,
}) => {
  return (
    <FlexContainer main="center" cross="center" className="gap-3">
      {scenario.map((symbol, i) => {
        let pillVariant: EvPillVariant = "neutral";
        if (symbol === optimalAction) {
          pillVariant = "optimal";
        } else if (i === selectedIndex) {
          pillVariant = "selected-wrong";
        }

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: reel count and order are fixed
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectSlot(i)}
              disabled={disabled}
              aria-pressed={selectedIndex === i}
              className={cn(
                "rounded-md disabled:cursor-not-allowed",
                selectedIndex === i && "ring-4 ring-yellow-400",
              )}
            >
              <Reel value={symbol} />
            </button>
            {actionValues && (
              <EvPill
                value={valueForAction(symbol, actionValues)}
                variant={pillVariant}
              />
            )}
          </div>
        );
      })}
    </FlexContainer>
  );
};

export default QuestionBoard;
