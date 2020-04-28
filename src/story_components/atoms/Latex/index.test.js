import React from "react";
import { render } from "@testing-library/react";
import Latex from "./";

it("renders without crashing", () => {
  render(<Latex />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
    <Latex
      displayMode
      str={`\\begin{aligned} A^{\\prime} (t) &= a \\times B(t), \\\\ B^{\\prime} (t) &= b \\times A(t), \\end{aligned}`}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
