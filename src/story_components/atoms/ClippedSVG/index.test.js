import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import ClippedSVG from ".";

const wrap = (props = {}) => shallow(<ClippedSVG {...props} />);

it("renders successfully", () => {
  const wrapper = wrap({ id: "svg", width: 600, height: 600, padding: 20 });
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("renders children when passed in successfully", () => {
  const wrapper = shallow(
    <ClippedSVG id="svg" width={500} height={300} padding={10}>
      <rect x={0} y={10} width={100} height={200} />
      <circle cx={300} cy={100} r={100} />
    </ClippedSVG>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
