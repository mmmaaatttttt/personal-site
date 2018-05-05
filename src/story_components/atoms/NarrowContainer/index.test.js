import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import NarrowContainer from ".";

const wrap = (props = {}) => shallow(<NarrowContainer {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ width: "50%", fullWidthAt: "small" });
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders children when passed in", () => {
  const wrapper = wrap(
    <NarrowContainer width="75%" fullWidthAt="small">
      <div>hello</div>
      <div>goodbye</div>
    </NarrowContainer>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
