import React from "react";
import GraphContainer from "../organisms/GraphContainer";
import PropTypes from "prop-types";
import withCaption from "../../hocs/withCaption";

const EconomySimulation = ({ caption }) => (
  <h1>hi</h1>
);

EconomySimulation.propTypes = {
  caption: PropTypes.string.isRequired
};

export default withCaption(EconomySimulation);
