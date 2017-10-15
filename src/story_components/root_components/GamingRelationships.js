import React, { Component } from "react";
import GraphContainer from "../organisms/GraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-relationships.js";

const GamingRelationships = ({ idx }) => (
  <GraphContainer data={visualizationData[idx]} />
);

GamingRelationships.propTypes = {
  idx: PropTypes.number.isRequired
};

export default GamingRelationships;
