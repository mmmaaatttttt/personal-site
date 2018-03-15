import COLORS from "utils/styles";

const PERSON_A_COLOR = COLORS.ORANGE;
const PERSON_B_COLOR = COLORS.GREEN;
const graph1Data = [
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Initial Feelings",
    color: PERSON_A_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: -1,
    title: "A's Response to B's Feelings",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: -3,
    title: "B's Initial Feelings",
    color: PERSON_B_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "B's Response to A's Feelings",
    color: PERSON_B_COLOR,
    equationParameter: true
  }
];

const graph2Data = [
  ...graph1Data.slice(0, 2),
  {
    min: -5,
    max: 5,
    initialValue: -0.3,
    title: "A's Response to A's Feelings",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  ...graph1Data.slice(2),
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "B's Response to B's Feelings",
    color: PERSON_B_COLOR,
    equationParameter: true
  }
];

const graph3Data = [
  ...graph2Data.slice(1, 3).map((d, i) => {
    const newVals = [1, -5];
    return { ...d, initialValue: newVals[i] };
  }),
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Intrinsic Appeal",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Response to B's Intrinsic Appeal",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  ...graph2Data.slice(4).map((d, i) => {
    const newVals = [2, -5];
    return { ...d, initialValue: newVals[i] };
  }),
  {
    min: -5,
    max: 5,
    initialValue: 4,
    title: "B's Intrinsic Appeal",
    color: PERSON_B_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: 2,
    title: "B's Response to A's Intrinsic Appeal",
    color: PERSON_B_COLOR,
    equationParameter: true
  }
];

const diffEq1 = (a, b) => (x, y) => [a * y[1], b * y[0]];
const diffEq2 = (a, b, c, d) => (x, y) => [
  a * y[1] + b * y[0],
  c * y[0] + d * y[1]
];
const diffEq3 = (a, b, c, d, e, f, g, h) => (x, y) => [
  a * y[1] + b * y[0] + d * g,
  e * y[0] + f * y[1] + h * c
];

const visualizationData = [
  {
    initialData: graph1Data,
    width: 800,
    height: 500,
    smallestY: 5,
    largestY: 100,
    diffEqs: [diffEq1],
    svgIds: ["vis1"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [PERSON_A_COLOR, PERSON_B_COLOR]
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq2],
    step: 0.02,
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [PERSON_A_COLOR, PERSON_B_COLOR]
  },
  {
    initialData: graph3Data,
    width: 800,
    height: 650,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq3],
    svgIds: ["vis3"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [PERSON_A_COLOR, PERSON_B_COLOR]
  }
];

export { graph2Data, diffEq2, PERSON_A_COLOR, PERSON_B_COLOR };

export default visualizationData;
