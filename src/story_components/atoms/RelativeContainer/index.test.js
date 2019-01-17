import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import RelativeContainer from ".";

it("renders successfully", () => {
  shallow(<RelativeContainer />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <RelativeContainer>
      <div>hello</div>
    </RelativeContainer>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
