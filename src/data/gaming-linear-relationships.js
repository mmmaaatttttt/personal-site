const PERSON_A_COLOR = "#FF8E5E";
const PERSON_B_COLOR = "#52A081";
const graph1Data = [
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Initial Feelings",
    id: "0|0",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: -1,
    title: "A's Response to B's Feelings",
    id: "0|1",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: -3,
    title: "B's Initial Feelings",
    id: "1|0",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "B's Response to A's Feelings",
    id: "1|1",
    color: PERSON_B_COLOR
  }
];

const graph2Data = [
  ...graph1Data,
  {
    min: -5,
    max: 5,
    initialValue: -0.3,
    title: "A's Response to A's Feelings",
    id: "0|2",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "B's Response to B's Feelings",
    id: "1|2",
    color: PERSON_B_COLOR
  }
];

const graph3Data = [
  ...graph2Data.filter(d => +d.id.split("|")[1] !== 0).map((d, i) => {
    const newVals = [1, 2, -5, -5];
    return { ...d, initialValue: newVals[i] };
  }),
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Intrinsic Appeal",
    id: "0|3",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Response to B's Intrinsic Appeal",
    id: "0|4",
    color: PERSON_A_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 4,
    title: "B's Intrinsic Appeal",
    id: "1|3",
    color: PERSON_B_COLOR
  },
  {
    min: -5,
    max: 5,
    initialValue: 2,
    title: "B's Response to A's Intrinsic Appeal",
    id: "1|4",
    color: PERSON_B_COLOR
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
const diffEq4 = (a, b, c, d) => (x, y) => [
  a * y[1] * (1 - Math.abs(y[1])) + b * y[0],
  c * y[0] * (1 - Math.abs(y[0])) + d * y[1]
];

const visualizationData = [
  {
    initialData: graph1Data,
    width: 800,
    height: 500,
    smallestY: 5,
    largestY: 100,
    diffEq: diffEq1,
    id: "vis1",
    xLabel: "Time",
    yLabel: "Feelings"
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEq: diffEq2,
    step: 0.02,
    id: "vis2",
    xLabel: "Time",
    yLabel: "Feelings"
  },
  {
    initialData: graph3Data,
    width: 800,
    height: 650,
    smallestY: 5,
    largestY: 200,
    diffEq: diffEq3,
    id: "vis3",
    xLabel: "Time",
    yLabel: "Feelings"
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 800,
    smallestY: 5,
    largestY: 200,
    diffEq: diffEq4,
    step: 0.02,
    id: "vis2",
    xLabel: "Time",
    yLabel: "Feelings"
  }
];

export { graph2Data, diffEq2, PERSON_A_COLOR, PERSON_B_COLOR };

export default visualizationData;
