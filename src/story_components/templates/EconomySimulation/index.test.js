import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { EconomySimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<EconomySimulation />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<EconomySimulation idx={0} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders second demonstration successfully", () => {
    const { asFragment } = render(<EconomySimulation idx={1} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<EconomySimulation idx={2} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("state changes", () => {
  it("shows 3 buttons once the simulation has started", () => {
    const { queryByText } = render(<EconomySimulation idx={0} />);

    const startBtn = queryByText("Start");
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);

    const chartBtn = queryByText("Show Chart");
    const resetBtn = queryByText("Reset");
    expect(startBtn).toHaveTextContent("Pause");
    expect(chartBtn).toBeInTheDocument();
    expect(resetBtn).toBeInTheDocument();
  });

  it("shows the bar graph when showingSimulation is false", () => {
    const { queryByText } = render(<EconomySimulation idx={0} />);

    const startBtn = queryByText("Start");
    fireEvent.click(startBtn);

    let text1 = queryByText("1");
    let text2 = queryByText("2");

    expect(text1).not.toBeInTheDocument();
    expect(text2).not.toBeInTheDocument();

    const chartBtn = queryByText("Show Chart");
    fireEvent.click(chartBtn);

    text1 = queryByText("1");
    text2 = queryByText("2");
    const nodesBtn = queryByText("Show Nodes");

    expect(text1).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
    expect(nodesBtn).toBeInTheDocument();
  });

  it("removes the bar graph on reset", () => {
    const { queryByText } = render(<EconomySimulation idx={0} />);

    const startBtn = queryByText("Start");
    fireEvent.click(startBtn);

    const chartBtn = queryByText("Show Chart");
    fireEvent.click(chartBtn);

    let text1 = queryByText("1");
    let text2 = queryByText("2");

    const resetBtn = queryByText("Reset");
    fireEvent.click(resetBtn);

    expect(text1).not.toBeInTheDocument();
    expect(text2).not.toBeInTheDocument();
  });
});
