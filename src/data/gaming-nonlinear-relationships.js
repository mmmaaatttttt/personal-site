import {
  graph2Data as graph1Data,
  diffEq2 as diffEq1
} from "./gaming-linear-relationships";

const diffEq2 = (a, b, c, d) => (x, y) => [
  a * y[1] * (1 - Math.abs(y[1])) + b * y[0],
  c * y[0] * (1 - Math.abs(y[0])) + d * y[1]
];

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
  }
];

export default visualizationData;
