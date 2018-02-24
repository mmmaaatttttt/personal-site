import React, { Component } from "react";
import PropTypes from "prop-types";
import { geoPath, geoAlbers } from "d3-geo";
import { json } from "d3-fetch";
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
    json(withPrefix("/data/us-topo.json")).then(us => this.setState({ us }));
  }

  render() {
    const { us } = this.state;
    const paths = us
      ? feature(us, us.objects.states).features.map(feature => {
          return (
            <path
              d={this.path(feature)}
              key={feature.id}
              fill="white"
              stroke="black"
              strokeWidth="2px"
            />
          );
        })
      : null;
    return (
      <ClippedSVG id="map" width={1600} height={900}>
        {paths}
      </ClippedSVG>
    );
  }
}

export default USMap;
