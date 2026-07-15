import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { evaluateActions, optimalStrategy } from "../../bonusMath";
import StrategyQuiz from ".";
import { QUIZ_SPINS_REMAINING, quizScenarios } from "./quizData";

function start() {
  render(<StrategyQuiz />);
  fireEvent.click(screen.getByText("Start Quiz!"));
}

function getConfirmButton() {
  return screen.getByRole("button", { name: "Confirm" });
}

function answerCurrentQuestion() {
  fireEvent.click(screen.getAllByRole("button")[0]);
  fireEvent.click(getConfirmButton());
}

describe("StrategyQuiz", () => {
  it("shows a start gate before the quiz begins", () => {
    render(<StrategyQuiz />);

    expect(screen.getByText("Start Quiz!")).toBeInTheDocument();
    expect(screen.queryByText(/Question 1 of/)).not.toBeInTheDocument();
  });

  it("shows the first question after starting, with the answer not yet revealed", () => {
    start();

    expect(
      screen.getByText(`Question 1 of ${quizScenarios.length}`),
    ).toBeInTheDocument();
    expect(screen.queryByText("✓")).not.toBeInTheDocument();
    expect(screen.queryByText("✗")).not.toBeInTheDocument();
  });

  it("keeps the confirm button disabled until a reel or Skip Bonus Spin is selected", () => {
    start();

    expect(getConfirmButton()).toBeDisabled();
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(getConfirmButton()).not.toBeDisabled();
  });

  it("deselects a reel when clicked again, re-disabling confirm", () => {
    start();

    const reel = screen.getAllByRole("button")[0];
    fireEvent.click(reel);
    expect(reel).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(reel);
    expect(reel).toHaveAttribute("aria-pressed", "false");
    expect(getConfirmButton()).toBeDisabled();
  });

  it("highlights only the exact reel clicked, not siblings sharing its symbol", () => {
    start();

    // Question 1 is DASH DASH DASH DASH — every reel shares a symbol.
    const reels = screen
      .getAllByRole("button")
      .filter((btn) => btn.hasAttribute("aria-pressed"));
    fireEvent.click(reels[0]);

    expect(reels[0]).toHaveAttribute("aria-pressed", "true");
    expect(reels[1]).toHaveAttribute("aria-pressed", "false");
    expect(reels[2]).toHaveAttribute("aria-pressed", "false");
    expect(reels[3]).toHaveAttribute("aria-pressed", "false");
  });

  it("selects Skip Bonus Spin as an answer distinct from any reel", () => {
    start();

    const skip = screen.getByText("Skip Bonus Spin");
    fireEvent.click(skip);
    expect(skip).toHaveAttribute("aria-pressed", "true");
    expect(getConfirmButton()).not.toBeDisabled();
  });

  it("does not reveal feedback until Confirm is clicked", () => {
    start();

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.queryByText("✓")).not.toBeInTheDocument();
    expect(screen.queryByText("✗")).not.toBeInTheDocument();

    fireEvent.click(getConfirmButton());
    expect(screen.getByText(/^(✓|✗)$/)).toBeInTheDocument();
  });

  it("shows an EV pill under every reel and the skip button once confirmed", () => {
    start();
    answerCurrentQuestion();

    // 4 reel pills + 1 skip-button pill, each formatted to 3 decimals
    expect(screen.getAllByText(/^-?\d+\.\d{3}$/)).toHaveLength(5);
  });

  it("locks in the answer after confirming, disabling further selection", () => {
    start();
    answerCurrentQuestion();

    for (const button of screen.getAllByRole("button")) {
      if (button.hasAttribute("aria-pressed")) {
        expect(button).toBeDisabled();
      }
    }
  });

  it("shows feedback matching the live-computed strategy value, not a hardcoded number", () => {
    start();

    const scenario = quizScenarios[0];
    const expectedStay = evaluateActions(scenario, QUIZ_SPINS_REMAINING).stay;

    fireEvent.click(screen.getByText("Skip Bonus Spin"));
    fireEvent.click(getConfirmButton());

    expect(
      screen.getByText(
        new RegExp(
          `The expected value of this move is ${expectedStay.toFixed(3).replace(".", "\\.")}`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it("advances through every question to the results screen", () => {
    start();

    for (let i = 0; i < quizScenarios.length; i++) {
      const isLast = i === quizScenarios.length - 1;
      answerCurrentQuestion();
      fireEvent.click(
        screen.getByText(isLast ? "Show My Results" : "Next Question"),
      );
    }

    expect(
      screen.getByText(new RegExp(`out of ${quizScenarios.length} questions`)),
    ).toBeInTheDocument();
  });

  it("returns to question 1 after clicking Try Again", () => {
    start();

    for (let i = 0; i < quizScenarios.length; i++) {
      const isLast = i === quizScenarios.length - 1;
      answerCurrentQuestion();
      fireEvent.click(
        screen.getByText(isLast ? "Show My Results" : "Next Question"),
      );
    }

    fireEvent.click(screen.getByText("Try Again!"));

    expect(
      screen.getByText(`Question 1 of ${quizScenarios.length}`),
    ).toBeInTheDocument();
  });

  it("counts a question correct only when the chosen action matches the optimal one", () => {
    start();

    // Force the "Skip Bonus Spin" (stay) answer for every question, then
    // verify the final tally matches how many scenarios actually have "stay"
    // as optimal under the one-bonus-spin model.
    for (let i = 0; i < quizScenarios.length; i++) {
      const isLast = i === quizScenarios.length - 1;
      fireEvent.click(screen.getByText("Skip Bonus Spin"));
      fireEvent.click(getConfirmButton());
      fireEvent.click(
        screen.getByText(isLast ? "Show My Results" : "Next Question"),
      );
    }

    const expectedCorrect = quizScenarios.filter(
      (scenario) =>
        optimalStrategy(scenario, QUIZ_SPINS_REMAINING).action === "stay",
    ).length;

    expect(
      screen.getByText(
        `You answered ${expectedCorrect} out of ${quizScenarios.length} questions correctly.`,
      ),
    ).toBeInTheDocument();
  });
});
