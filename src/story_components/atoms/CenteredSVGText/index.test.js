import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import CenteredSVGText from ".";

it("renders successfully", () => {
  shallow(<CenteredSVGText />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <CenteredSVGText fontSize="90%" baseline="central">
      in the center
    </CenteredSVGText>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
