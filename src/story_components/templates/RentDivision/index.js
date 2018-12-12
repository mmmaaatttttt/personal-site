import React, { Component } from "react";
import PropTypes from "prop-types";
import { ColumnLayout, ClippedSVG, Tooltip} from "story_components";
import COLORS from "utils/styles";

class RentDivision extends Component {
  state = {

  }

  render() {
    return <ColumnLayout>
      <ClippedSVG width="600" height="600" id="rent">

      </ClippedSVG>
    </ColumnLayout>
  }
}

RentDivision.propTypes = {
  rent: PropTypes.number.isRequired,
  roomColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RentDivision.defaultProps = {
  rent: 2400,
  roomColors: [COLORS.ORANGE, COLORS.PURPLE, COLORS.GREEN],
  names: ["Alex", "Brett", "Cameron"]
};

export default RentDivision;