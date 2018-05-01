import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AspectRatioWrapper from ".";

const wrap = (props = {}) => shallow(<AspectRatioWrapper {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders children when passed in successfully", () => {
  const wrapper = shallow(
    <AspectRatioWrapper>
      <p>Hello World</p>
    </AspectRatioWrapper>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({ heightOverWidth: 3 / 4 });
  expect(toJson(wrapper)).toMatchSnapshot();
});
