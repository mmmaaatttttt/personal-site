import React from "react";
import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
import withCaption from "hocs/withCaption"
import { GamingLinearRelationships } from ".";

it("renders successfully", () => {
  shallow(<GamingLinearRelationships />);
});

// it("matches snapshot with props passed in", () => {
//   const wrapper = shallow(
//     <GamingLinearRelationships color="blue" large disabled>
//       I'm a GamingLinearRelationships
//     </GamingLinearRelationships>
//   );
//   expect(toJson(wrapper)).toMatchSnapshot();
// });
