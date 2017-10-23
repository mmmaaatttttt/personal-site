import {
  graph2Data as graph1Data,
  diffEq2 as diffEq1,
  PERSON_A_COLOR,
  PERSON_B_COLOR
} from "./gaming-linear-relationships";

const PERSON_C_COLOR = "red";

const graph2Data = [
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Initial Feelings",
    id: "0|0",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: -4,
    title: "A's Response to B's Feelings for A",
    id: "0|1",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 1.1,
    title: "A's Response to A's Feelings",
    id: "0|2",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "B's Initial Feelings for A",
    id: "1|0",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "B's Response to A & C's Feelings",
    id: "1|1",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: -2,
    title: "B's Response to B's Feelings",
    id: "1|2",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "B's Initial Feelings for C",
    id: "2|0",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "C's Initial Feelings",
    id: "3|0",
    color: PERSON_C_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 1.5,
    title: "C's Response to B's Feelings for C",
    id: "3|1",
    color: PERSON_C_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: -1,
    title: "C's Response to C's Feelings",
    id: "3|2",
    color: PERSON_C_COLOR
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

// initial data from paper
// b => -7
// a => 2
// c => 4
// d => -3
// e => -1
// f = > 3

// initial data from python code
// b => -4
// a => 1.1
// c => 3
// d => -2
// f => 1.5
// e => -1

const visualizationData = [
  {
    initialData: graph1Data.map((d, i) => {
      const newVals = [4, 3, -2, -5, 1, -2];
      return { ...d, initialValue: newVals[i] };
    }),
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq1, diffEq2],
    ids: ["vis1", "vis2"],
    step: 0.02
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq3, diffEq3],
    ids: ["vis3", "vis4"],
    step: 0.02
  }
];

export default visualizationData;
