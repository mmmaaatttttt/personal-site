import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Button from ".";

it("renders successfully", () => {
  shallow(<Button />);
});

it("matches snapshot with props passed in", () => {
  const wrapper = shallow(
    <Button color="blue" large disabled>
      I'm a button
    </Button>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
