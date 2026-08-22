import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Quiz from "./index";

// Mock the animated sub-component
vi.mock("./QuizReviewPanel", () => ({
  default: ({
    resultsIndex,
    question,
    userAnswer,
  }: {
    resultsIndex: number;
    question: { prompt: string };
    userAnswer: string;
  }) => (
    <div data-testid="mock-review-panel">
      Reviewing index {resultsIndex}: {question.prompt}. User said {userAnswer}.
    </div>
  ),
}));

// Mock mathHelpers for deterministic questions
vi.mock("@/utils/mathHelpers", () => ({
  choices: <T,>(data: T[], count: number) => data.slice(0, count),
}));

describe("Quiz Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders start screen correctly", () => {
    render(<Quiz title="Test Quiz" maxQuestions={5} />);
    expect(screen.getByText("Test Quiz")).toBeInTheDocument();
    expect(screen.getByText("Start Quiz!")).toBeInTheDocument();
  });

  it("progresses through questions and shows results", () => {
    render(<Quiz title="Test Quiz" maxQuestions={2} />);

    // Start
    fireEvent.click(screen.getByText("Start Quiz!"));

    // Q1
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(screen.getByText(/Who said:/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    // Button 0 is the first choice.
    fireEvent.click(buttons[0]);
    fireEvent.click(screen.getByText("Next Question"));

    // Q2
    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    const buttons2 = screen.getAllByRole("button");
    fireEvent.click(buttons2[0]);
    fireEvent.click(screen.getByText("Show My Results"));

    // Results
    expect(screen.getByText(/You answered/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-review-panel")).toBeInTheDocument();
  });

  it("navigates between review results with the prev/next buttons", () => {
    render(<Quiz title="Test Quiz" maxQuestions={2} />);

    fireEvent.click(screen.getByText("Start Quiz!"));
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Next Question"));
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Show My Results"));

    const prevButton = screen.getByLabelText("Previous question results");
    const nextButton = screen.getByLabelText("Next question results");

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();

    fireEvent.click(prevButton);
    expect(prevButton).toBeDisabled();
  });

  it("allows resetting the quiz", () => {
    render(<Quiz title="Test Quiz" maxQuestions={1} />);
    fireEvent.click(screen.getByText("Start Quiz!"));
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Show My Results"));

    expect(screen.getByText(/You answered/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Try Again!"));

    expect(screen.getByText("Start Quiz!")).toBeInTheDocument();
  });
});
