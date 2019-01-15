import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ColoredSpan from ".";

it("renders successfully", () => {
  shallow(<ColoredSpan />);
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <ColoredSpan bold color="blue">
      i'm blue, da bo dee da bo dah
    </ColoredSpan>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
