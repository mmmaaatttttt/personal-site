import React from "react";
import { render } from "@testing-library/react";
import StyledTable from "./";

it("renders without crashing", () => {
  render(<StyledTable />);
});

it("matches snapshot with props and children", () => {
  const { asFragment } = render(
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
  expect(asFragment()).toMatchSnapshot();
});
