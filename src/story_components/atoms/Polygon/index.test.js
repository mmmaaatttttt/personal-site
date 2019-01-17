import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Polygon from ".";

it("renders successfully", () => {
  shallow(<Polygon />);
});

it("matches snapshot with props passed", () => {
  const wrapper = shallow(
    <Polygon fill="blue" stroke="purple" strokeWidth={1} points={[
      { x: 50, y: 50 },
      { x: 100, y: 200 },
      { x: 0, y: 200 }
    ]}>
      <div>hello</div>
      <div>goodbye</div>
    </Polygon>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
