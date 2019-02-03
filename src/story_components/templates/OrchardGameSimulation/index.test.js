import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { OrchardGameSimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<OrchardGameSimulation />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<OrchardGameSimulation />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<OrchardGameSimulation />);
  });

  it("has a working play button", () => {
    expect(wrapper.state().playing).toBe(false);
    const buttons = wrapper.find("Button");
    expect(buttons).toHaveLength(2);
    buttons.first().simulate("click");
    expect(wrapper.state().playing).toBe(true);
    expect(wrapper.find("Button")).toHaveLength(1);
  });

  it("has a working pause button", () => {
    wrapper.setState({ playing: true });
    const buttons = wrapper.find("Button");
    expect(buttons).toHaveLength(1);
    buttons.first().simulate("click");
    expect(wrapper.state().playing).toBe(false);
    expect(wrapper.find("Button")).toHaveLength(2);
  });

  it("has a working reset button", () => {
    wrapper.setState({
      playData: [
        { gamesPlayed: 10, gamesWon: 5 },
        { gamesPlayed: 10, gamesWon: 6 },
        { gamesPlayed: 10, gamesWon: 7 },
        { gamesPlayed: 10, gamesWon: 8 }
      ]
    });
    wrapper
      .find("Button")
      .at(1)
      .simulate("click");
    expect(wrapper.state().playData).toEqual([
      { gamesPlayed: 0, gamesWon: 0 },
      { gamesPlayed: 0, gamesWon: 0 },
      { gamesPlayed: 0, gamesWon: 0 },
      { gamesPlayed: 0, gamesWon: 0 }
    ]);
  });
});
