import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { HarassmentSimulation } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<HarassmentSimulation />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<HarassmentSimulation idx={0} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders second demonstraction successfully", () => {
    const wrapper = shallow(<HarassmentSimulation idx={1} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders third demonstraction successfully", () => {
    const wrapper = shallow(<HarassmentSimulation idx={2} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("state changes", () => {
  it("sets up bars correctly in first demonstration", () => {
    const wrapper = shallow(<HarassmentSimulation idx={0} />);
    wrapper.setState({ playing: true });
    const bars = wrapper.find("HorizontalBar");
    expect(bars).toHaveLength(2);
    expect(bars.first().props().data).toEqual([
      { size: 10, color: "#5ECFFF", tooltipText: "Blue count: 10" },
      { size: 20, color: "#52A081", tooltipText: "Green count: 20" }
    ]);
    expect(bars.at(1).props().data).toEqual([
      {
        color: "#5ECFFF",
        size: 0,
        tooltipText: "Harassment heard by blue, coming from green: 0"
      },
      {
        color: "#52A081",
        size: 0,
        tooltipText: "Harassment heard by green, coming from blue: 0"
      }
    ]);
  });

  it("sets up bars correctly in second demonstration", () => {
    const wrapper = shallow(<HarassmentSimulation idx={1} />);
    wrapper.setState({ playing: true });
    const bars = wrapper.find("HorizontalBar");
    expect(bars).toHaveLength(2);
    expect(bars.first().props().data).toEqual([
      { size: 10, color: "#5ECFFF", tooltipText: "Blue count: 10" },
      { size: 20, color: "#52A081", tooltipText: "Green count: 20" }
    ]);
    expect(bars.at(1).props().data).toEqual([
      {
        color: "#5ECFFF",
        size: 0,
        tooltipText: "Harassment heard by blue, coming from green: 0"
      },
      {
        color: "#52A081",
        size: 0,
        tooltipText: "Harassment heard by green, coming from blue: 0"
      }
    ]);
  });

  it("sets up bars correctly in second demonstration", () => {
    const wrapper = shallow(<HarassmentSimulation idx={2} />);
    wrapper.setState({ playing: true });
    const bars = wrapper.find("HorizontalBar");
    expect(bars).toHaveLength(2);
    expect(bars.first().props().data).toEqual([
      { size: 10, color: "#5ECFFF", tooltipText: "Blue count: 10" },
      { size: 20, color: "#52A081", tooltipText: "Green count: 20" }
    ]);
    expect(bars.at(1).props().data).toEqual([
      {
        color: "#00adf7",
        size: 0,
        tooltipText: "Harassment heard only by blue, coming from blue: 0"
      },
      {
        color: "#5ECFFF",
        size: 0,
        tooltipText: "Harassment heard by blue, coming from green: 0"
      },
      {
        color: "#52A081",
        size: 0,
        tooltipText: "Harassment heard by green, coming from blue: 0"
      },
      {
        color: "#2f5d4b",
        size: 0,
        tooltipText: "Harassment heard only by green, coming from green: 0"
      }
    ]);
  });
});
