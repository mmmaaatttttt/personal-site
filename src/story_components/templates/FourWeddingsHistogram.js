import React, { Component } from "react";
import SelectableHistogram from "../organisms/SelectableHistogram";
import PropTypes from "prop-types";
import { getData, selectOptionsHistogram } from "../../data/four-weddings.js";

class FourWeddingsHistogram extends Component {
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
      <SelectableHistogram
        data={weddingData}
        caption={`${caption}`}
        selectOptions={selectOptionsHistogram}
      />
    ) : null;
  }
}

FourWeddingsHistogram.propTypes = {
  caption: PropTypes.string.isRequired
};

export default FourWeddingsHistogram;
