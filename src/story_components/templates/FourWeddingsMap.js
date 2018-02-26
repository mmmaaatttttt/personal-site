import React, { Component } from "react";
import SelectableHeatMap from "../organisms/SelectableHeatMap";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { getData, selectOptionsMap } from "../../data/four-weddings.js";
import { average } from "../../utils/mathHelpers";

class FourWeddingsMap extends Component {
  state = {
    weddingData: []
  };

  componentDidMount() {
    getData().then(weddingData => this.setState({ weddingData }));
  }

  getTooltipTitle = properties => properties.name;

  getTooltipBody = properties => {
    const weddingCount = properties.values && properties.values.length;
    if (weddingCount) {
      const averageCost = average(properties.values, d => d.cost);
      return [
        `Number of weddings: ${weddingCount}`,
        `Average Cost: ${format("$,.0f")(averageCost)}`
      ];
    }
    return `No weddings for this state.`;
  };

  render() {
    const { weddingData } = this.state;
    const { caption } = this.props;
    return weddingData.length ? (
      <SelectableHeatMap
        data={weddingData}
        caption={`${caption}`}
        selectOptions={selectOptionsMap}
        getTooltipTitle={this.getTooltipTitle}
        getTooltipBody={this.getTooltipBody}
      />
    ) : null;
  }
}

FourWeddingsMap.propTypes = {
  caption: PropTypes.string.isRequired
};

export default FourWeddingsMap;
