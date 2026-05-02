"use client";

import { AnimatePresence, motion } from "framer-motion";

interface QuizReviewPanelProps {
  resultsIndex: number;
  question: {
    prompt: string;
    answer: string;
  };
  userAnswer: string;
}

const QuizReviewPanel: React.FC<QuizReviewPanelProps> = ({
  resultsIndex,
  question,
  userAnswer,
}) => {
  const isCorrect = question.answer === userAnswer;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={resultsIndex}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 shadow-sm ${
          isCorrect ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"
        }`}
      >
        <p className="mb-4 text-center text-lg font-bold w-full">
          {question.prompt}
        </p>
        <div className="flex flex-col gap-1 w-full text-center text-sm">
          <p>
            You chose: <span className="font-bold underline">{userAnswer}</span>.
          </p>
          <p>
            Correct answer: <span className="font-bold underline">{question.answer}</span>.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizReviewPanel;
