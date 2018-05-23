import React, { Component } from "react";
import PropTypes from "prop-types";
import { json } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import {
  // Button,
  // FlexContainer,
  HeatChart,
  NarrowContainer
} from "story_components";
import withCaption from "hocs/withCaption";
// import { camelCaseToTitle } from "utils/stringHelpers";

class OrchardGameHeatData extends Component {
  state = {
    colorCount: this.props.initialColorCount,
    data: [],
    shading: this.props.initialShading,
    wildCardCount: this.props.initialWildCardCount
  };

  componentDidMount() {
    json(withPrefix("data/orchard_game.json")).then(data => {
      this.setState({ data });
    });
  }

  render() {
    const { data, colorCount, wildCardCount, shading } = this.state;
    const heatData = data
      .filter(d => d.colors === colorCount && d.wildCardCount === wildCardCount)
      .reduce((matrix, obj) => {
        let x = obj.ravenCount - 1;
        let y = obj.fruits - 1;
        if (!matrix[x]) matrix[x] = [];
        matrix[x][y] = obj;
        return matrix;
      }, []);
    return (
      <NarrowContainer width="80%">
        <HeatChart data={heatData} accessor={d => d.probs[shading]} />
      </NarrowContainer>
    );
  }
}

OrchardGameHeatData.propTypes = {};

OrchardGameHeatData.defaultProps = {
  initialWildCardCount: 1,
  initialColorCount: 4,
  initialShading: "mostPlentiful"
};

export default withCaption(OrchardGameHeatData);
