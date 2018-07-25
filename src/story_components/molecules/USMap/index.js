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
import { Tooltip, ClippedSVG } from "story_components";

class USMap extends Component {
  state = {
    us: null,
    tooltipVisible: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipTitle: "",
    tooltipBody: ""
  };

  componentWillMount() {
    const { scale, translate } = this.props;
    const projection = geoAlbers()
      .scale(scale)
      .translate(translate);
    this.path = geoPath().projection(projection);
  }

  componentDidMount() {
    const { data, addGeometryProperties, topoUrl } = this.props;
    json(withPrefix(topoUrl)).then(us => {
      addGeometryProperties(us, data);
      this.setState({ us });
    });
  }

  handleEnterAndUpdate = (scale, accessor, d) => {
    return {
      fill: [
        // d.properties.values ? scale(accessor(d.properties.values)) : "#eee"
        "#eee"
      ],
      timing: { duration: 500 }
    };
  };

  handleTooltipShow = (data, e) => {
    const { getTooltipTitle, getTooltipBody } = this.props;
    this.setState({
      tooltipVisible: true,
      tooltipX: e.pageX,
      tooltipY: e.pageY,
      tooltipTitle: getTooltipTitle(data),
      tooltipBody: getTooltipBody(data)
    });
  };

  handleTooltipHide = e => {
    this.setState({ tooltipVisible: false });
  };

  render() {
    const {
      us,
      tooltipVisible,
      tooltipX,
      tooltipY,
      tooltipTitle,
      tooltipBody
    } = this.state;
    const { fillAccessor, colors, topoKey, keyAccessor } = this.props;
    let paths = null;
    if (us) {
      const geomCollection = us.objects[topoKey];
      // const domain = extent(
      //   geomCollection.geometries.filter(d => d.properties.values),
      //   d => fillAccessor(d.properties.values)
      // );
      const colorScale = scaleLinear()
        // .domain(domain)
        // .range(colors)
        .domain([0, 1])
        .range(["#eee", "#eee"]);
      paths = (
        <NodeGroup
          data={feature(us, geomCollection).features}
          keyAccessor={keyAccessor}
          start={() => ({ fill: "white" })}
          enter={this.handleEnterAndUpdate.bind(this, colorScale, fillAccessor)}
          update={this.handleEnterAndUpdate.bind(
            this,
            colorScale,
            fillAccessor
          )}
          leave={() => {}}
        >
          {districts => (
            <g>
              {districts.map(curState => (
                <path
                  d={this.path(curState.data)}
                  key={curState.key}
                  fill={curState.state.fill}
                  stroke="white"
                  strokeWidth="4px"
                  onMouseMove={this.handleTooltipShow.bind(
                    this,
                    curState.data.properties
                  )}
                  onMouseLeave={this.handleTooltipHide}
                  onTouchMove={this.handleTooltipShow.bind(
                    this,
                    curState.data.properties
                  )}
                  onTouchEnd={this.handleTooltipHide}
                />
              ))}
            </g>
          )}
        </NodeGroup>
      );
    }
    return (
      <div>
        <ClippedSVG id="us-map" width={1600} height={900}>
          {paths}
        </ClippedSVG>
        <Tooltip
          visible={tooltipVisible}
          x={tooltipX}
          y={tooltipY}
          title={tooltipTitle}
          body={tooltipBody}
        />
      </div>
    );
  }
}

USMap.propTypes = {
  addGeometryProperties: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  fillAccessor: PropTypes.func.isRequired,
  getTooltipBody: PropTypes.func.isRequired,
  getTooltipTitle: PropTypes.func.isRequired,
  keyAccessor: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  topoUrl: PropTypes.string.isRequired,
  topoKey: PropTypes.string.isRequired,
  translate: PropTypes.arrayOf(PropTypes.number).isRequired
};

USMap.defaultProps = {
  addGeometryProperties: function(us, data) {
    const stateData = nest()
      .key(d => d.state)
      .entries(data);
    stateData.forEach(stateObj => {
      const stateGeometry = us.objects.states.geometries.find(
        geometry => geometry.properties.name === stateObj.key
      );
      stateGeometry.properties.values = stateObj.values;
    });
  },
  keyAccessor: feature => feature.id,
  scale: 1950,
  topoUrl: "/data/us-topo.json",
  topoKey: "states",
  translate: [800, 460]
};

export default USMap;
