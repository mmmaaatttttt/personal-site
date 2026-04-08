"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { choices } from "@/utils/mathHelpers";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Caption from "@/components/story/shared/Caption";
import baQuizData from "../data/ba-quiz.json";

interface Question {
  prompt: string;
  choices: string[];
  answer: string;
}

interface QuizProps {
  answerColors?: string[];
  maxQuestions?: number;
  title?: string;
  caption?: string;
}

const Quiz: React.FC<QuizProps> = ({
  answerColors = ["#ff5700", "#10b981", "#3b82f6"],
  maxQuestions = 10,
  title = "This is a quiz.",
  caption,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [resultsIndex, setResultsIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setQuestions(choices(baQuizData, maxQuestions));
    setMounted(true);
  }, [maxQuestions]);

  if (!baQuizData || baQuizData.length === 0) return null;
  if (!mounted) return null;

  const reset = () => {
    setQuestions(choices(baQuizData, maxQuestions));
    setAnswers(null);
    setSelectedAnswer(null);
    setResultsIndex(0);
  };

  let panel;
  if (answers === null) {
    panel = (
      <>
        <h2 className="mb-6 font-serif text-3xl font-bold">{title}</h2>
        <button
          onClick={() => setAnswers([])}
          className="mt-4 rounded-md bg-link px-8 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
        >
          Start Quiz!
        </button>
      </>
    );
  } else if (answers.length === questions.length) {
    const numCorrect = answers.reduce((total, answer, idx) => total + +(questions[idx].answer === answer), 0);
    const q = questions[resultsIndex];
    const isCorrect = q.answer === answers[resultsIndex];
    
    panel = (
      <>
        <h2 className="mb-2 font-serif text-2xl font-bold text-gray-800">
          You answered {numCorrect} out of {answers.length} questions correctly.
        </h2>
        <h3 className="mb-6 text-xl font-medium text-gray-600">
          Accuracy: {((numCorrect * 100) / answers.length).toFixed(2)}%
        </h3>
        
        <div className="relative w-full max-w-lg mx-auto mb-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Review ({resultsIndex + 1}/{questions.length})</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={resultsIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 shadow-sm ${isCorrect ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}
            >
              <p className="mb-4 text-center text-lg font-bold w-full">{q.prompt}</p>
              <div className="flex flex-col gap-1 w-full text-center text-sm">
                <p>You chose: <span className="font-bold underline">{answers[resultsIndex]}</span>.</p>
                <p>Correct answer: <span className="font-bold underline">{q.answer}</span>.</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={() => setResultsIndex(prev => Math.max(0, prev - 1))}
            disabled={resultsIndex === 0}
            className="absolute top-1/2 -left-4 p-2 rounded-full bg-white shadow-md disabled:opacity-30"
          >
            ←
          </button>
          <button 
            onClick={() => setResultsIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={resultsIndex === questions.length - 1}
            className="absolute top-1/2 -right-4 p-2 rounded-full bg-white shadow-md disabled:opacity-30"
          >
            →
          </button>
        </div>

        <button
          onClick={reset}
          className="mt-2 rounded-md bg-link px-8 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
        >
          Try Again!
        </button>
      </>
    );
  } else {
    const currentNum = answers.length + 1;
    const question = questions[answers.length];

    panel = (
      <>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-500">
          Question {currentNum} of {questions.length}
        </h3>
        <h2 className="mb-8 font-serif text-2xl font-semibold leading-relaxed text-gray-900">
          "{question.prompt}"
        </h2>
        <div className="flex w-full max-w-lg flex-col gap-3">
          {question.choices.map((choice, i) => {
            const isSelected = selectedAnswer === choice;
            return (
              <button
                key={choice}
                onClick={() => setSelectedAnswer(choice)}
                className={`w-full rounded-md border-2 px-6 py-3 font-medium transition-colors ${
                  isSelected ? "border-link bg-orange-50 text-link" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        <button
          disabled={!selectedAnswer}
          onClick={() => {
            if (selectedAnswer) {
              setAnswers([...answers, selectedAnswer]);
              setSelectedAnswer(null);
            }
          }}
          className="mt-8 rounded-md bg-link px-8 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
        >
          {currentNum < questions.length ? "Next Question" : "Show My Results"}
        </button>
      </>
    );
  }

  return (
    <div className="my-12 w-full">
      <div className="mx-auto flex min-h-[50vh] flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-8 text-center shadow-inner">
        {panel}
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
};

export default Quiz;
