import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { geoPath, geoAlbers } from "d3-geo";
import { scaleLinear } from "d3-scale";
import { json } from "d3-fetch";
import { nest } from "d3-collection";
import { extent } from "d3-array";
import { feature } from "topojson";
import { withPrefix } from "gatsby-link";
import ClippedSVG from "../atoms/ClippedSVG";

class USMap extends Component {
  state = {
    us: null
  };

  componentWillMount() {
    const { scale, translate } = this.props;
    const projection = geoAlbers()
      .scale(scale)
      .translate(translate);
    this.path = geoPath().projection(projection);
  }

  componentDidMount() {
    json(withPrefix("/data/us-topo.json")).then(us => {
      const { data } = this.props;
      const stateData = nest()
        .key(d => d.state)
        .entries(data);
      stateData.forEach(stateObj => {
        const stateGeometry = us.objects.states.geometries.find(
          geometry => geometry.properties.name === stateObj.key
        );
        stateGeometry.properties.values = stateObj.values;
      });
      this.setState({ us });
    });
  }

  handleEnterAndUpdate = (scale, accessor, d) => {
    return {
      fill: [
        d.properties.values ? scale(accessor(d.properties.values)) : "#eee"
      ],
      timing: { duration: 500 }
    };
  };

  render() {
    const { us } = this.state;
    let { fillAccessor, colors } = this.props;
    let paths = null;
    if (us) {
      const { states } = us.objects;
      const domain = extent(
        states.geometries.filter(d => d.properties.values),
        d => fillAccessor(d.properties.values)
      );
      const colorScale = scaleLinear()
        .domain(domain)
        .range(colors);
      paths = (
        <NodeGroup
          data={feature(us, states).features}
          keyAccessor={feature => feature.id}
          start={() => ({ fill: "white" })}
          enter={this.handleEnterAndUpdate.bind(this, colorScale, fillAccessor)}
          update={this.handleEnterAndUpdate.bind(
            this,
            colorScale,
            fillAccessor
          )}
          leave={() => {}}
        >
          {states => (
            <g>
              {states.map(curState => (
                <path
                  d={this.path(curState.data)}
                  key={curState.key}
                  fill={curState.state.fill}
                  stroke="white"
                  strokeWidth="4px"
                />
              ))}
            </g>
          )}
        </NodeGroup>
      );
    }
    return (
      <ClippedSVG id="us-map" width={1600} height={900}>
        {paths}
      </ClippedSVG>
    );
  }
}

USMap.defaultProps = {
  scale: 2000,
  translate: [800, 450]
};

USMap.propTypes = {
  scale: PropTypes.number.isRequired,
  translate: PropTypes.arrayOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  fillAccessor: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default USMap;
