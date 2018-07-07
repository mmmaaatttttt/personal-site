import COLORS from "utils/styles";

const POPULATION_COLOR = COLORS.BLUE;
const graph1Data = [
  {
    min: 0.1,
    max: 10,
    initialValue: 1,
    title: "Doubling time for population",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];

const exponential = dblTime => (x, y) => [(Math.LN2 / dblTime) * y];
// const diffEq2 = (a, b, c, d) => (x, y) => [
//   a * y[1] + b * y[0],
//   c * y[0] + d * y[1]
// ];
// const diffEq3 = (a, b, c, d, e, f, g, h) => (x, y) => [
//   a * y[1] + b * y[0] + d * g,
//   e * y[0] + f * y[1] + h * c
// ];

const visualizationData = [
  {
    initialData: graph1Data,
    width: 800,
    height: 500,
    smallestY: 0,
    largestY: 100,
    diffEqs: [exponential],
    svgIds: ["vis1"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR]
  }
];

export default visualizationData;
