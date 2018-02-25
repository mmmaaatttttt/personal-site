import React, { Component } from "react";
import PropTypes from "prop-types";
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

  static defaultProps = {
    scale: 2000,
    translate: [800, 450]
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

  render() {
    const { us } = this.state;
    let paths = null;
    if (us) {
      const { states } = us.objects;
      const domain = extent(
        states.geometries,
        d => (d.properties.values ? d.properties.values.length : 0)
      );
      const colorScale = scaleLinear()
        .domain(domain)
        .range(["#ffecd1", "orange"]);
      paths = feature(us, states).features.map(feature => {
        const { values } = feature.properties;
        return (
          <path
            d={this.path(feature)}
            key={feature.id}
            fill={values ? colorScale(values.length) : "#eee"}
            stroke="white"
            strokeWidth="4px"
          />
        );
      });
    }
    return (
      <ClippedSVG id="map" width={1600} height={900}>
        {paths}
      </ClippedSVG>
    );
  }
}

USMap.propTypes = {
  scale: PropTypes.number.isRequired,
  translate: PropTypes.arrayOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(PropTypes.object)
};

export default USMap;
