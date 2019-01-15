import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import Latex from ".";

it("renders successfully", () => {
  <Latex />;
});

it("matches snapshot", () => {
  const wrapper = (
    <Latex
      displayMode
      str={`\\begin{aligned} A^{\\prime} (t) &= a \\times B(t), \\\\ B^{\\prime} (t) &= b \\times A(t), \\end{aligned}`}
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
