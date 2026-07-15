import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FeedbackPanel from "./FeedbackPanel";

describe("FeedbackPanel", () => {
  it("shows a check mark and says this is the optimal move when correct", () => {
    render(<FeedbackPanel isCorrect={true} ev={12.345} />);

    expect(screen.getByText("✓")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The expected value of this move is 12.345. This is the optimal move!",
      ),
    ).toBeInTheDocument();
  });

  it("shows an x mark and says this is not the optimal move when incorrect", () => {
    render(<FeedbackPanel isCorrect={false} ev={-1.2} />);

    expect(screen.getByText("✗")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The expected value of this move is -1.200. This is not the optimal move!",
      ),
    ).toBeInTheDocument();
  });
});
