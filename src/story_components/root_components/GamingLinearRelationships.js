import React, { Component } from "react";
import GraphContainer from "../organisms/GraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-linear-relationships.js";

const GamingLinearRelationships = ({ idx, caption }) => (
  <GraphContainer
    {...visualizationData[idx]}
    caption={`Figure ${idx+1}: ${caption}`}
  />
);

GamingLinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  caption: PropTypes.string.isRequired
};

export default GamingLinearRelationships;
