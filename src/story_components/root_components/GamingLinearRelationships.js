import React, { Component } from "react";
import GraphContainer from "../organisms/GraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-linear-relationships.js";

const GamingLinearRelationships = ({ idx }) => (
  <GraphContainer data={visualizationData[idx]} />
);

GamingLinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired
};

export default GamingLinearRelationships;
