import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { OrchardGameSimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<OrchardGameSimulation />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<OrchardGameSimulation />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("state changes", () => {
  it("manages button state correctly", () => {
    const { debug, queryByText } = render(<OrchardGameSimulation />);
    const playBtn = queryByText("Play");

    const resetBtn = queryByText("Reset Simulation");

    // expect both buttons to appear initially
    expect(playBtn).toBeInTheDocument();
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(playBtn);

    expect(playBtn).toHaveTextContent("Pause");
    expect(resetBtn).not.toBeInTheDocument();

    fireEvent.click(playBtn);

    expect(playBtn).toHaveTextContent("Play");
    expect(resetBtn).toBeInTheDocument();
    expect(wrapper.state().playing).toBe(false);
  });
});
