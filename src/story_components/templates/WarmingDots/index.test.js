import React from "react";
import { render } from "@testing-library/react";
import { WarmingDots } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    render(<WarmingDots />);
  });

  it("renders first demonstration successfully", () => {
    const { asFragment } = render(<WarmingDots idx={0} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders second demonstration successfully", () => {
    const { asFragment } = render(<WarmingDots idx={1} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders third demonstration successfully", () => {
    const { asFragment } = render(<WarmingDots idx={2} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders fourth demonstration successfully", () => {
    const { asFragment } = render(<WarmingDots idx={3} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders fifth demonstration successfully", () => {
    const { asFragment } = render(<WarmingDots idx={4} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
