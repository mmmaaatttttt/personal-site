import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { geoPath, geoAlbers } from "d3-geo";
import { scaleLinear } from "d3-scale";
import { nest } from "d3-collection";
import { extent } from "d3-array";
import { feature } from "topojson";
import { isEqual } from "lodash";
import us from "data/json/us-topo.json";
import { ClippedSVG } from "story_components";
import { TooltipProvider } from "providers";
import COLORS from "utils/styles";

class USMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      us: null
    };

    const { scale, translate } = props;
    const projection = geoAlbers()
      .scale(scale)
      .translate(translate);
    this.path = geoPath().projection(projection);
  }

  componentDidMount() {
    const { data, addGeometryProperties } = this.props;
    addGeometryProperties(us, data);
    this.setState({ us });
  }

  componentDidUpdate(prevProps) {
    const oldData = prevProps.data;
    const newData = this.props.data;
    if (!isEqual(oldData, newData)) {
      this.props.addGeometryProperties(us, newData);
      this.setState({ us });
    }
  }

  createColorScale = () => {
    let { topoKey, domain, colors, fillAccessor } = this.props;
    const { us } = this.state;
    if (!domain)
      domain = extent(
        us.objects[topoKey].geometries.filter(d => d.properties.values),
        d => fillAccessor(d.properties)
      );
    return scaleLinear()
      .domain(domain)
      .range(colors);
  };

  handleEnterAndUpdate = d => {
    const { fillAccessor } = this.props;
    const colorScale = this.createColorScale();
    let fill = COLORS.LIGHT_GRAY;
    if (d.properties.values && fillAccessor(d.properties) !== null) {
      fill = colorScale(fillAccessor(d.properties));
    }
    return {
      fill: [fill],
      timing: { duration: 500 }
    };
  };

  renderPathGroup = (tooltipShow, tooltipHide) => districts => {
    return (
      <g>
        {districts.map(({ data, key, state }) => {
          const { getTooltipBody, getTooltipTitle } = this.props;
          const title = getTooltipTitle(data.properties);
          const body = getTooltipBody(data.properties);
          return (
            <path
              d={this.path(data)}
              key={key}
              fill={state.fill}
              stroke="white"
              strokeWidth="4px"
              onMouseMove={tooltipShow(title, body)}
              onMouseLeave={tooltipHide}
              onTouchMove={tooltipShow(title, body)}
              onTouchEnd={tooltipHide}
            />
          );
        })}
      </g>
    );
  };

  render() {
    const { us } = this.state;
    let { keyAccessor, topoKey, id } = this.props;
    return us ? (
      <div>
        <TooltipProvider
          render={(tooltipShow, tooltipHide) => (
            <ClippedSVG id={id} width={1600} height={900}>
              <NodeGroup
                data={feature(us, us.objects[topoKey]).features}
                keyAccessor={keyAccessor}
                start={() => ({ fill: "white" })}
                enter={this.handleEnterAndUpdate}
                update={this.handleEnterAndUpdate}
              >
                {this.renderPathGroup(tooltipShow, tooltipHide)}
              </NodeGroup>
            </ClippedSVG>
          )}
        />
      </div>
    ) : null;
  }
}

USMap.propTypes = {
  addGeometryProperties: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  domain: PropTypes.arrayOf(PropTypes.number),
  fillAccessor: PropTypes.func.isRequired,
  getTooltipBody: PropTypes.func.isRequired,
  getTooltipTitle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  keyAccessor: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
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
  id: "us-map",
  keyAccessor: feature => feature.id,
  scale: 1950,
  topoKey: "states",
  translate: [800, 460]
};

export default USMap;
