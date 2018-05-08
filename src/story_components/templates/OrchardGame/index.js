import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "story_components";
import COLORS from "utils/styles";

class OrchardGame extends Component {
  render() {
    return (
      <div>
        <h1>hi</h1>
        <Spinner colors={this.props.spinnerColors} />
      </div>
    );
  }
}

OrchardGame.defaultProps = {
  spinnerColors: [
    COLORS.RED,
    COLORS.DARK_GREEN,
    COLORS.DARK_BLUE,
    COLORS.YELLOW,
    COLORS.BLACK,
    COLORS.WHITE
  ]
};

export default OrchardGame;
