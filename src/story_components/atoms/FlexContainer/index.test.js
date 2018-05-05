import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import FlexContainer from ".";

const wrap = (props = {}) => shallow(<FlexContainer {...props} />);

it("renders successfully", () => {
  const wrapper = wrap();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders props when passed in", () => {
  const wrapper = wrap({
    column: true,
    wrap: true,
    main: "center",
    cross: "center"
  });
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders children when passed in successfully", () => {
  const wrapper = shallow(
    <FlexContainer column>
      <div>Here's a child</div>
      <div>Here's another</div>
      <div>Here's a third</div>
    </FlexContainer>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
