import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ClippedSVG from ".";

it("renders successfully", () => {
  shallow(<ClippedSVG />);
});

it("renders with an object for padding", () => {
  shallow(
    <ClippedSVG padding={{ top: 10, right: 20, bottom: 30, left: 40 }} />
  );
});

it("matches snapshot", () => {
  const wrapper = shallow(
    <ClippedSVG id="svg" width={500} height={300} padding={10}>
      <rect x={0} y={10} width={100} height={200} />
      <circle cx={300} cy={100} r={100} />
    </ClippedSVG>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
