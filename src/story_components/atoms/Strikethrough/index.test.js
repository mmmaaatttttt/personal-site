import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Strikethrough from ".";

it("renders successfully", () => {
  shallow(<Strikethrough />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <Strikethrough>striking out</Strikethrough>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
