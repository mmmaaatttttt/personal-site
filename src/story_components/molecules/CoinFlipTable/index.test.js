import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { CoinFlipTable } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<CoinFlipTable />);
  });

  it("matches snapshot for fair coin", () => {
    const wrapper = shallow(<CoinFlipTable />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("matches snapshot for unfair coin", () => {
    const wrapper = shallow(<CoinFlipTable />);
    wrapper.setState({ headsProp: 0.24 });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
