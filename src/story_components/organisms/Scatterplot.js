import React, { Component } from "react";
import PropTypes from "prop-types";
// import { arc, pie } from "d3-shape";
// import { format } from "d3-format";
import NodeGroup from "react-move/NodeGroup";
// import { scaleOrdinal } from "d3-scale";
// import COLORS from "../../utils/styles";
import ClippedSVG from "../atoms/ClippedSVG";

class Scatterplot extends Component {
  render() {
    const { values, width, height, padding } = this.props;
    // const arcs = pie().sortValues(
    //   (a, b) => values.indexOf(a) - values.indexOf(b)
    // )(values);
    // const colorScale = scaleOrdinal().range([
    //   COLORS.BLUE,
    //   COLORS.GREEN,
    //   COLORS.ORANGE,
    //   COLORS.RED
    // ]);
    // const pathArc = arc()
    //   .innerRadius(0)
    //   .outerRadius(width / 2 - padding);
    // const paths = (
    //   <NodeGroup
    //     data={arcs}
    //     keyAccessor={(d, i) => i}
    //     start={({ startAngle }) => ({ startAngle, endAngle: startAngle })}
    //     enter={({ endAngle }) => ({
    //       endAngle: [endAngle],
    //       timing: { duration: 500 }
    //     })}
    //     update={({ startAngle, endAngle }) => ({
    //       startAngle: [startAngle],
    //       endAngle: [endAngle],
    //       timing: { duration: 500 }
    //     })}
    //   >
    //     {arcNodes => (
    //       <g transform={`translate(${width / 2}, ${height / 2})`}>
    //         {arcNodes.map(({ key, data, state }) => {
    //           const textCenter = pathArc.centroid(state);
    //           const { startAngle, endAngle } = state;
    //           const percentage = (endAngle - startAngle) / (2 * Math.PI);
    //           return (
    //             <g key={key}>
    //               <path
    //                 d={pathArc(state)}
    //                 fill={colorScale(key)}
    //                 stroke="white"
    //                 strokeWidth="3px"
    //               />
    //               <text
    //                 transform={`translate(${textCenter.toString()})`}
    //                 textAnchor="middle"
    //                 fontSize="24"
    //                 fill="white"
    //               >
    //                 {format(".1%")(percentage)}
    //               </text>
    //             </g>
    //           );
    //         })}
    //       </g>
    //     )}
    //   </NodeGroup>
    // );
    return (
      <div>
        <ClippedSVG id="scatter-plot" width={width} height={height}>
          <text x={width / 2} y={height / 2}>
            THIS IS A SCATTERPLOTZ
          </text>
        </ClippedSVG>
      </div>
    );
  }
}

Scatterplot.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

Scatterplot.defaultProps = {
  width: 600,
  height: 600,
  padding: 0
};

export default Scatterplot;
