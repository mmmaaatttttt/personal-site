import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import COLORS from "utils/styles";
import CoinFlipBayesianModel from "./";

describe("smoke and snapshot tests", () => {
  it("renders without crashing", () => {
    render(<CoinFlipBayesianModel />);
  });

  it("matches snapshot for a fair coin", () => {
    const { asFragment } = render(<CoinFlipBayesianModel />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("interaction tests", () => {
  it("handles switch change", () => {
    const { getByText } = render(<CoinFlipBayesianModel />);

    const bottomSVGText = getByText("Coin flip distribution");
    const span = getByText("Fair coin more likely");
    const toggleSwitch = span.previousSibling;
    const path = bottomSVGText.previousSibling;

    expect(path.getAttribute("stroke")).toEqual(COLORS.RED);
    fireEvent.click(toggleSwitch);
    waitFor(
      () => {
        expect(path.getAttribute("stroke")).toEqual(COLORS.BLUE);
      },
      { timeout: 400 }
    );
  });

  it("handles heads increase", () => {
    const { queryByText } = render(<CoinFlipBayesianModel />);

    const headsBtn = queryByText("Heads: 0");
    fireEvent.click(headsBtn);

    expect(queryByText("Heads: 0")).not.toBeInTheDocument();
    expect(queryByText("Heads: 1")).toBeInTheDocument();
  });

  it("handles tails increase", () => {
    const { queryByText } = render(<CoinFlipBayesianModel />);

    const tailsBtn = queryByText("Tails: 0");
    fireEvent.click(tailsBtn);

    expect(queryByText("Tails: 0")).not.toBeInTheDocument();
    expect(queryByText("Tails: 1")).toBeInTheDocument();
  });

  it("handles reset", () => {
    const { queryByText } = render(<CoinFlipBayesianModel />);

    const tailsBtn = queryByText("Tails: 0");
    const headsBtn = queryByText("Heads: 0");
    const resetBtn = queryByText("Reset Counts");
    fireEvent.click(tailsBtn);
    fireEvent.click(headsBtn);
    fireEvent.click(headsBtn);
    expect(queryByText("Tails: 1")).toBeInTheDocument();
    expect(queryByText("Heads: 2")).toBeInTheDocument();
    
    fireEvent.click(resetBtn);
    expect(queryByText("Tails: 1")).not.toBeInTheDocument();
    expect(queryByText("Tails: 0")).toBeInTheDocument();
    expect(queryByText("Heads: 2")).not.toBeInTheDocument();
    expect(queryByText("Heads: 0")).toBeInTheDocument();
  });
});
