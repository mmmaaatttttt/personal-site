import React from "react";
import { render } from "@testing-library/react";
import { HarassmentSimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<HarassmentSimulation />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<HarassmentSimulation idx={0} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders second demonstraction successfully", () => {
    const { asFragment } = render(<HarassmentSimulation idx={1} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders third demonstraction successfully", () => {
    const { asFragment } = render(<HarassmentSimulation idx={2} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
