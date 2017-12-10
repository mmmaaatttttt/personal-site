import React, { Component } from "react";
import GraphContainer from "../organisms/GraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-nonlinear-relationships.js";

const GamingNonlinearRelationships = ({ idx, caption, double }) => (
  <GraphContainer
    {...visualizationData[idx]}
    caption={`Figure ${idx+1}: ${caption}`}
    double
  />
);

GamingNonlinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  caption: PropTypes.string.isRequired,
  double: PropTypes.bool.isRequired
};

GamingNonlinearRelationships.defaultProps = {
  double: true
};

export default GamingNonlinearRelationships;
