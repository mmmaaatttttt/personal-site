import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { CoinFlipHistogram } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<CoinFlipHistogram />);
  });

  it("renders first demonstration successfully", () => {
    const wrapper = shallow(<CoinFlipHistogram />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
