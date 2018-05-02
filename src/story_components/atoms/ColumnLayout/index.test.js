import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ColumnLayout from ".";

const wrap = (props = {}) => shallow(<ColumnLayout {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ break: "small" });
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders children when passed in successfully", () => {
  const wrapper = shallow(
    <ColumnLayout break="large">
      <div>Here's a child</div>
      <div>Here's another</div>
    </ColumnLayout>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
