import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import StyledTable from ".";

it("renders successfully", () => {
  shallow(<StyledTable />);
});

it("matches snapshot with props", () => {
  const wrapper = shallow(
    <StyledTable margin="1rem">
      <thead>
        <tr>
          <th>1</th>
          <th>2</th>
        </tr>
        <tr>
          <td>3</td>
          <td>4</td>
        </tr>
      </thead>
    </StyledTable>
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});
