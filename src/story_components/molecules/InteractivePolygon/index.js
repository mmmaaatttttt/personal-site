import React, { Component } from "react";
import PropTypes from "prop-types";

class InteractivePolygon extends Component {
  state = {
    sides: this.props.initialSides
  }

  render() {
    return null
  }
}

InteractivePolygon.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired,
};

InteractivePolygon.defaultProps = {
  cx: 0,
  cy: 0,
  initialSides: 3
};

export default InteractivePolygon;