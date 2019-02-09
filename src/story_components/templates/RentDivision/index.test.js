import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { RentDivision } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<RentDivision />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<RentDivision />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
