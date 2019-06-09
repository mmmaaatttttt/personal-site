import React, { Component } from "react";
import PropTypes from "prop-types";
import { DraggableCircle, Graph, NarrowContainer } from "story_components";
import { svgProps, svgDefaultProps } from "utils/types";

class DistanceExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [{ x: 2, y: 2 }, { x: -2, y: -2 }]
    };
  }

  handleDrag = (idx, x, y) => {
    this.setState(st => {
      const pointsCopy = [...st.points];
      const { xScale, yScale } = this.props;
      pointsCopy[idx] = { x: xScale.invert(x), y: yScale.invert(y) };
      return { points: pointsCopy };
    });
  };

  render() {
    const { points } = this.state;
    const { width, height, xScale, yScale } = this.props;
    return (
      <NarrowContainer>
        <Graph
          xAxisPosition="center"
          yAxisPosition="center"
          width={width}
          height={height}
          xScale={xScale}
          yScale={yScale}
        >
          {points.map((point, idx) => (
            <DraggableCircle
              key={idx}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              onDrag={({ x, y }) => this.handleDrag(idx, x, y)}
            />
          ))}
        </Graph>
      </NarrowContainer>
    );
    // return <Graph />;
  }
}

DistanceExplorer.propTypes = {
  ...svgProps
};

DistanceExplorer.defaultProps = {
  ...svgDefaultProps
};

export default DistanceExplorer;
