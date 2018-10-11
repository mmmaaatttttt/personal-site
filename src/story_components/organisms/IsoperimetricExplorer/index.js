import React, { Component } from "react";
import PropTypes from "prop-types";
import { ClippedSVG, InteractivePolygon } from "story_components";

class IsoperimetricExplorer extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <ClippedSVG width={width} height={height}>
        <rect x="100" y="100" width="100" height="200" />
        <InteractivePolygon cx={width / 2} cy={height / 2} initialSides={3} />
      </ClippedSVG>
    );
  }
}

IsoperimetricExplorer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

IsoperimetricExplorer.defaultProps = {
  width: 600,
  height: 600
};

export default IsoperimetricExplorer;
