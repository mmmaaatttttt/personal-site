import React, { Component } from "react";
import SelectableHeatMap from "../organisms/SelectableHeatMap";
import PropTypes from "prop-types";
import { getData } from "../../data/four-weddings.js";

class FourWeddingsMap extends Component {
  state = {
    weddingData: []
  };

  componentDidMount() {
    getData().then(weddingData => this.setState({ weddingData }));
  }

  render() {
    const { weddingData } = this.state;
    const { caption } = this.props;
    return weddingData.length ? (
      <SelectableHeatMap data={weddingData} caption={`${caption}`} />
    ) : null;
  }
}

FourWeddingsMap.propTypes = {
  caption: PropTypes.string.isRequired
};

export default FourWeddingsMap;
