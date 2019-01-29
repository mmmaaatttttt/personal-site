import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { EconomySimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<EconomySimulation />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<EconomySimulation idx={0} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders second demonstration successfully", () => {
    const wrapper = shallow(<EconomySimulation idx={1} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<EconomySimulation idx={2} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  it("shows 3 buttons once the simulation has started", () => {
    const wrapper = shallow(<EconomySimulation idx={0} />);
    expect(wrapper.childAt(1).props().data).toHaveLength(1);
    wrapper.setState({ playing: true });
    expect(wrapper.childAt(1).props().data).toHaveLength(3);
  });

  it("shows the bar graph when showingSimulation is false", () => {
    const wrapper = shallow(<EconomySimulation idx={0} />);
    expect(wrapper.find("BarGraph")).toHaveLength(0);
    wrapper.setState({ showingSimulation: false });
    expect(wrapper.find("BarGraph")).toHaveLength(1);
  });

  it("removes the bar graph on reset", () => {
    const wrapper = shallow(<EconomySimulation idx={0} />);
    wrapper.setState({ showingSimulation: false });
    expect(wrapper.find("BarGraph")).toHaveLength(1);
    wrapper.instance().handleStop();
    expect(wrapper.find("BarGraph")).toHaveLength(0);
  });
});
