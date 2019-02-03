import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { OrchardGame } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<OrchardGame />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<OrchardGame />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<OrchardGame />);
  });

  it("shows an overlay before playing", () => {
    expect(wrapper.find("ScreenOverlay")).toHaveLength(1);
    wrapper
      .find("Button")
      .first()
      .simulate("click");
    expect(wrapper.state().gameState).toBe("playing");
    expect(wrapper.find("ScreenOverlay")).toHaveLength(0);
  });

  it("decrements counts when landing on a wedge", () => {
    wrapper.instance().updateCounts(0);
    expect(wrapper.state().counts).toEqual([3, 4, 4, 4, 5]);
  });

  it("handles wins", () => {
    wrapper.setState({ counts: [0, 1, 0, 0, 2] });
    wrapper.instance().updateCounts(1);
    expect(wrapper.state().gameState).toEqual("win");
    const overlay = wrapper.find("ScreenOverlay");
    expect(overlay).toHaveLength(1);
    expect(overlay.find("h1").text()).toBe("You won!");
  });

  it("handles losses", () => {
    wrapper.setState({ counts: [0, 2, 1, 2, 1] });
    wrapper.instance().updateCounts(4);
    expect(wrapper.state().gameState).toEqual("loss");
    const overlay = wrapper.find("ScreenOverlay");
    expect(overlay).toHaveLength(1);
    expect(overlay.find("h1").text()).toBe("You lost.");
  });

  it("handles the fruit basket", () => {
    wrapper.setState({ gameState: "playing" });
    wrapper.instance().updateCounts(5);
    expect(wrapper.state().fruitBasketEnabled).toEqual(true);
    expect(wrapper.find("Spinner").props().message).toBe(
      "Click on a square to remove a fruit."
    );
  });
});
