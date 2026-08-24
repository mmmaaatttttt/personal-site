import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import QuizReviewPanel from "./QuizReviewPanel";

const question = { prompt: "Who said this line?", answer: "Alice" };

describe("QuizReviewPanel", () => {
  it("shows a correct styling when the user answer matches", () => {
    const { container } = render(
      <QuizReviewPanel
        resultsIndex={0}
        question={question}
        userAnswer="Alice"
      />,
    );
    expect(container.querySelector(".bg-green-50")).toBeInTheDocument();
    expect(screen.getByText(question.prompt)).toBeInTheDocument();
  });

  it("shows an incorrect styling when the user answer doesn't match", () => {
    const { container } = render(
      <QuizReviewPanel resultsIndex={1} question={question} userAnswer="Bob" />,
    );
    expect(container.querySelector(".bg-red-50")).toBeInTheDocument();
  });
});
