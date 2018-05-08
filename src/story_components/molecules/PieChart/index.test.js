import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// import PieChart from ".";

xit("breaks if we import PieChart", () => {});

// doesn't work -- fix import
// const wrap = (props = {}) => shallow(<PieChart {...props} />);

// it("renders successfully", () => {
//   const wrapper = wrap({ values: [1], colorScale: i => "red" });
//   expect(toJson(wrapper)).toMatchSnapshot();
// });

// it("renders props when passed in", () => {
//   const wrapper = wrap({ width: "50%", fullWidthAt: "small" });
//   expect(toJson(wrapper)).toMatchSnapshot();
// });
