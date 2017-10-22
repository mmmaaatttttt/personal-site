import React, { Component } from "react";
import DoubleGraphContainer from "../organisms/DoubleGraphContainer";
import PropTypes from "prop-types";
import visualizationData from "../../data/gaming-nonlinear-relationships.js";

const GamingNonlinearRelationships = ({ idx }) => (
  <DoubleGraphContainer data={visualizationData[idx]} />
);

GamingNonlinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired
};

export default GamingNonlinearRelationships;
