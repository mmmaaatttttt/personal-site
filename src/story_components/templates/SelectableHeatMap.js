import React, { Component } from "react";
import PropTypes from "prop-types";
import { json, csv } from "d3-fetch";
// import { histogram, max, range, extent } from "d3-array";
// import { scaleLinear } from "d3-scale";
import { withPrefix } from "gatsby-link";
import { handleCSV } from "../../data/four-weddings";
import withCaption from "../../hocs/withCaption";
// import BarGraph from "../organisms/BarGraph";
// import COLORS from "../../utils/styles";
import USMap from "../organisms/USMap";
// import "react-select/dist/react-select.css";

class SelectableHeatMap extends Component {
  state = {
    // selectedOption: this.props.selectOptions[0],
    weddingData: [],
    stateData: []
  };

  componentDidMount() {
    return Promise.all([
      csv(withPrefix("/data/four_weddings.csv"), handleCSV)
    ]).then(data => {
      this.setState({ data });
    });
  }

  render() {
    return (
      <div>
        <USMap />
      </div>
    );
  }
}

SelectableHeatMap.defaultProps = {};

export default withCaption(SelectableHeatMap);
