import COLORS from "utils/styles";

const POPULATION_COLOR = COLORS.BLUE;
const graph1Data = [
  {
    min: 0,
    max: 5,
    initialValue: 1,
    title: "Growth Rate for the Population",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];
const graph2Data = [
  ...graph1Data,
  {
    min: 0,
    max: 100,
    initialValue: 10,
    title: "Carrying Capacity for the Environment",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];

const exponential = A => (x, y) => [A * y];
const logistic = (A, K) => (x, y) => [A * y * (1 - y / K)];
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
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 500,
    smallestY: 0,
    largestY: 100,
    diffEqs: [logistic],
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR]
  }
];

export default visualizationData;
