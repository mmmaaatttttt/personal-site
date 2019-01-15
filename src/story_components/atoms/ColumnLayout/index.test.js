import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ColumnLayout from ".";

it("renders successfully", () => {
  shallow(<ColumnLayout />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <ColumnLayout break="large">
      <div>Here's a child</div>
      <div>Here's another</div>
    </ColumnLayout>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("lets you make columns of different widths", () => {
  const wrapper = shallow(
    <ColumnLayout break="small" sizes={[3, 2]}>
      <div>Here's a child</div>
      <div>Here's another</div>
    </ColumnLayout>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
