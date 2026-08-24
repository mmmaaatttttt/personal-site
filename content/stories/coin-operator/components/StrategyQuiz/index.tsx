"use client";

import type { FC } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { evaluateActions, optimalStrategy } from "../../bonusMath";
import EvPill, { type EvPillVariant } from "./EvPill";
import FeedbackPanel from "./FeedbackPanel";
import QuestionBoard from "./QuestionBoard";
import {
  DEFAULT_QUIZ_SPIN_MODE,
  QUIZ_SPIN_MODES,
  type QuizSpinMode,
  quizScenarios,
} from "./quizData";
import { type QuizAction, valueForAction } from "./quizMath";

type Selection = { type: "slot"; index: number } | { type: "stay" };

const CONTAINER_CLASSES =
  "mx-auto flex min-h-[600px] flex-col items-center justify-center gap-6 rounded-lg bg-light-gray p-6 md:p-8 text-center shadow-inner";

const START_BUTTON_CLASSES =
  "mt-4 rounded-md bg-link px-8 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95 text-sm md:text-base";

const CHOICE_BUTTON_CLASSES =
  "rounded-md border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 text-sm transition-colors hover:border-gray-400 disabled:cursor-not-allowed md:text-base";

function bonusSpinLabel(mode: QuizSpinMode): string {
  return mode === 1 ? "1 Bonus Spin" : `${mode} Bonus Spins`;
}

const StrategyQuiz: FC = () => {
  const [started, setStarted] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState<QuizSpinMode>(
    DEFAULT_QUIZ_SPIN_MODE,
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAction[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const reset = () => {
    setStarted(false);
    setIndex(0);
    setAnswers([]);
    setSelection(null);
    setConfirmed(false);
  };

  const startWithMode = (mode: QuizSpinMode) => {
    setSpinsRemaining(mode);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className={CONTAINER_CLASSES}>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Which spin, if any, is best?
        </h3>
        <p>Test your skill at assessing the optimal strategy.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {QUIZ_SPIN_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => startWithMode(mode)}
              className={START_BUTTON_CLASSES}
            >
              {bonusSpinLabel(mode)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (index === quizScenarios.length) {
    const numCorrect = answers.reduce(
      (total, answer, i) =>
        total +
        +(answer === optimalStrategy(quizScenarios[i], spinsRemaining).action),
      0,
    );

    return (
      <div className={CONTAINER_CLASSES}>
        <h2 className="mb-2 font-serif text-2xl font-bold text-gray-800">
          You answered {numCorrect} out of {answers.length} questions correctly.
        </h2>
        <h3 className="mb-6 text-xl font-medium text-gray-600">
          Accuracy: {((numCorrect * 100) / answers.length).toFixed(2)}%
        </h3>
        <button type="button" onClick={reset} className={START_BUTTON_CLASSES}>
          Try Again!
        </button>
      </div>
    );
  }

  const scenario = quizScenarios[index];
  const strategy = optimalStrategy(scenario, spinsRemaining);
  const actionValues = evaluateActions(scenario, spinsRemaining);

  let selectedAction: QuizAction | null = null;
  if (selection?.type === "stay") {
    selectedAction = "stay";
  } else if (selection?.type === "slot") {
    selectedAction = scenario[selection.index];
  }

  const selectedSlotIndex = selection?.type === "slot" ? selection.index : null;

  let skipPillVariant: EvPillVariant = "neutral";
  if (strategy.action === "stay") {
    skipPillVariant = "optimal";
  } else if (selectedAction === "stay") {
    skipPillVariant = "selected-wrong";
  }

  const handleSelectSlot = (slotIndex: number) => {
    setSelection((prev) =>
      prev?.type === "slot" && prev.index === slotIndex
        ? null
        : { type: "slot", index: slotIndex },
    );
  };

  const handleNoBonus = () => {
    setSelection((prev) => (prev?.type === "stay" ? null : { type: "stay" }));
  };

  const handleConfirm = () => {
    const action = selectedAction as QuizAction;
    setConfirmed(true);
    setAnswers((prev) => [...prev, action]);
  };

  const handleNext = () => {
    setSelection(null);
    setConfirmed(false);
    setIndex((prev) => prev + 1);
  };

  return (
    <div className={CONTAINER_CLASSES}>
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
        Question {index + 1} of {quizScenarios.length} (
        {bonusSpinLabel(spinsRemaining)})
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <QuestionBoard
          scenario={scenario}
          selectedIndex={selectedSlotIndex}
          disabled={confirmed}
          onSelectSlot={handleSelectSlot}
          actionValues={confirmed ? actionValues : null}
          optimalAction={confirmed ? strategy.action : null}
        />
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleNoBonus}
            disabled={confirmed}
            aria-pressed={selectedAction === "stay"}
            className={cn(
              CHOICE_BUTTON_CLASSES,
              selectedAction === "stay" && "border-link bg-orange-50",
            )}
          >
            Skip Bonus Spin
          </button>
          {confirmed && (
            <EvPill value={actionValues.stay} variant={skipPillVariant} />
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={selectedAction === null || confirmed}
        className={cn(
          START_BUTTON_CLASSES,
          "mt-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none",
        )}
      >
        Confirm
      </button>
      {confirmed && selectedAction !== null && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <FeedbackPanel
            isCorrect={selectedAction === strategy.action}
            ev={valueForAction(selectedAction, actionValues)}
          />
          <button
            type="button"
            onClick={handleNext}
            className={cn(START_BUTTON_CLASSES, "mt-0")}
          >
            {index + 1 < quizScenarios.length
              ? "Next Question"
              : "Show My Results"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategyQuiz;
