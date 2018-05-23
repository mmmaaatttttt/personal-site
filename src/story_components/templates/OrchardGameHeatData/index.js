import React, { Component } from "react";
import PropTypes from "prop-types";
import { json } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import {
  // Button,
  FlexContainer
  // HorizontalBar,
  // NarrowContainer
} from "story_components";
import withCaption from "hocs/withCaption";
// import COLORS from "utils/styles";
// import { camelCaseToTitle } from "utils/stringHelpers";

class OrchardGameHeatData extends Component {
  state = {
    colorCount: this.props.initialColorCount,
    wildCardCount: this.props.initialWildCardCount,
    data: []
  };

  componentDidMount() {
    json(withPrefix("data/orchard_game.json")).then(data => {
      debugger;
      this.setState({ data });
    });
  }

  render() {
    let { data, colorCount, wildCardCount } = this.state;
    let heatData = data
      .filter(d => d.colors === colorCount && d.wildCardCount === wildCardCount)
      .reduce((matrix, obj) => {
        let x = obj.ravenCount - 1;
        let y = obj.fruits - 1;
        if (!matrix[x]) matrix[x] = [];
        matrix[x][y] = obj;
        return matrix;
      }, []);
    return <h1>hi</h1>;
  }
}

OrchardGameHeatData.propTypes = {};

OrchardGameHeatData.defaultProps = {
  initialWildCardCount: 1,
  initialColorCount: 4,
  initialShading: "mostPlentiful"
};

export default withCaption(OrchardGameHeatData);
