import React, { Component } from "react";
import DoubleGraphContainer from "../organisms/DoubleGraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-nonlinear-relationships.js";

const GamingNonlinearRelationships = ({ idx, caption }) => (
  <GraphContainer
    data={visualizationData[idx]}
    caption={`Figure ${idx+1}: ${caption}`}
    double
  />
);

GamingNonlinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  caption: PropTypes.string.isRequired,
  double: PropTypes.bool.isRequired
};

export default GamingNonlinearRelationships;
