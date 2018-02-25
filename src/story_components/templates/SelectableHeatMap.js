import React, { Component } from "react";
import PropTypes from "prop-types";
import { json, csv } from "d3-fetch";
import Select from "react-select";
import { withPrefix } from "gatsby-link";
import { handleCSV } from "../../data/four-weddings";
import withCaption from "../../hocs/withCaption";
import USMap from "../organisms/USMap";
import "react-select/dist/react-select.css";

class SelectableHeatMap extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    csv(withPrefix("/data/four_weddings.csv"), handleCSV).then(data => {
      this.setState({ data });
    });
  }

  render() {
    return (
      <div>
        <USMap data={this.state.data} />
      </div>
    );
  }
}

export default withCaption(SelectableHeatMap);
