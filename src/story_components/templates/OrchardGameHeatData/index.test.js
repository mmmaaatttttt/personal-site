import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { OrchardGameHeatData } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<OrchardGameHeatData />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<OrchardGameHeatData />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});