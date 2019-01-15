import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import FlexContainer from ".";

it("renders successfully", () => {
  shallow(<FlexContainer />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <FlexContainer
      column
      wrap
      main="center"
      cross="center"
      margin="1rem"
      textAlign="right"
      width="90%"
    >
      <div>Here's a child</div>
      <div>Here's another</div>
      <div>Here's a third</div>
    </FlexContainer>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
