import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { EfficiencyGapTable } from ".";

describe("smoke and snapshot tests", () => {
  it("renders successfully", () => {
    shallow(<EfficiencyGapTable />);
  });

  it("renders with no district counts", () => {
    const wrapper = shallow(<EfficiencyGapTable />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders with district counts", () => {
    const wrapper = shallow(
      <EfficiencyGapTable
        districtCounts={[[[5, 4], [5, 4], [5, 4], [5, 4], [2, 7], [5, 4]]]}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
