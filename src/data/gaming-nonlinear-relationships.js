import {
  graph2Data as graph1Data,
  diffEq2 as diffEq1,
  PERSON_A_COLOR,
  PERSON_B_COLOR
} from "./gaming-linear-relationships";

const PERSON_C_COLOR = "#A05E52";

const graph2Data = [
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Initial Feelings",
    color: PERSON_A_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: -4,
    title: "A's Response to B's Feelings for A",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: 1.1,
    title: "A's Response to A's Feelings",
    color: PERSON_A_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "B's Initial Feelings for A",
    color: PERSON_B_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "B's Response to A & C's Feelings",
    color: PERSON_B_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: -2,
    title: "B's Response to B's Feelings",
    color: PERSON_B_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "B's Initial Feelings for C",
    color: PERSON_B_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "C's Initial Feelings",
    color: PERSON_C_COLOR,
    equationParameter: false
  },
  {
    min: -5,
    max: 5,
    initialValue: 1.5,
    title: "C's Response to B's Feelings for C",
    color: PERSON_C_COLOR,
    equationParameter: true
  },
  {
    min: -5,
    max: 5,
    initialValue: -1,
    title: "C's Response to C's Feelings",
    color: PERSON_C_COLOR,
    equationParameter: true
  }
];

const diffEq2 = (a, b, c, d) => (x, y) => [
  a * y[1] * (1 - Math.abs(y[1])) + b * y[0],
  c * y[0] * (1 - Math.abs(y[0])) + d * y[1]
];
const diffEq3 = (b, a, c, d, f, e) => (x, y) => [
  a * y[0] + b * y[1] * (1 - Math.abs(y[1])),
  c * (y[0] - y[3]) * (1 - Math.abs(y[0] - y[3])) + d * y[1],
  c * (y[3] - y[0]) * (1 - Math.abs(y[3] - y[0])) + d * y[2],
  e * y[3] + f * y[2] * (1 - Math.abs(y[2]))
];

const visualizationData = [
  {
    initialData: graph1Data.map((d, i) => {
      const newVals = [4, 3, 1, -2, -5, -2];
      return { ...d, initialValue: newVals[i] };
    }),
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq1, diffEq2],
    svgIds: ["vis1", "vis2"],
    step: 0.02,
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
    diffEqs: [diffEq3, diffEq3],
    svgIds: ["vis3", "vis4"],
    step: 0.02,
    max: 40,
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [PERSON_A_COLOR, PERSON_B_COLOR, PERSON_B_COLOR, PERSON_C_COLOR]
  }
];

export default visualizationData;
