import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AspectRatioWrapper from ".";

it("renders successfully", () => {
  shallow(<AspectRatioWrapper />);
});

it("matches snapshot with props and children", () => {
  const wrapper = shallow(
    <AspectRatioWrapper heightOverWidth={ 3 / 4 }>
      <p>Hello World</p>
    </AspectRatioWrapper>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
