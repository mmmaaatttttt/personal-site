import COLORS from "utils/styles";

const POPULATION_COLOR = COLORS.BLUE;
const ENVIRONMENT_COLOR = COLORS.RED;
const width = 800;
const height = 500;
const graph1Data = [
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "step-forward",
    title: "Growth rate for the population",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];
const graph2Data = [
  ...graph1Data,
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 10,
    maxIcon: "users",
    minIcon: "user",
    title: "Carrying capacity for the environment",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];
const graph3Data = [
  ...graph1Data,
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "step-forward",
    minIcon: "fast-forward",
    title: "Population growth factor due to harvesting resource",
    color: POPULATION_COLOR,
    equationParameter: true
  },
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 10,
    maxIcon: "users",
    minIcon: "user",
    title: "Carrying capacity in a natural (unpolluted) environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 1,
    max: 100,
    initialValue: 10,
    maxIcon: "tree",
    minIcon: "dizzy",
    title: "Threshold beyond which the environment can't support a population",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "recycle",
    minIcon: "trash",
    title: "Recovery rate for the environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "dizzy",
    minIcon: "tree",
    title: "Rate at which resource depletion harms the environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  }
];
const graph4Data = [
  ...graph3Data,
  {
    min: 0,
    max: 1,
    initialValue: 1,
    // maxIcon: "step-forward",
    // minIcon: "fast-forward",
    title: "How much destruction occurs before resource transition?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 0.01,
    max: 1,
    step: 0.01,
    initialValue: 0,
    // maxIcon: "tree",
    // minIcon: "dizzy",
    title: "How quickly does the resource transition occur?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  }
];
const graph5Data = [
  ...graph4Data,
  {
    min: 0,
    max: 2,
    initialValue: 0,
    // maxIcon: "users",
    // minIcon: "user",
    title: "How fragile is the environment?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  }
];

const K = (K_0, e_c, e) => K_0 * (1 - e / e_c);
const H = x => (1 + Math.tanh(x)) / 2;
const exponential = A => (x, y) => [A * y];
const logistic = (A, r) => (x, y) => [A * y * (1 - y / r)];
const model1 = (A, B, K_0, e_c, C, D) => (x, y) => [
  A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
  -C * y[1] + D * y[0]
];
const model2 = (A, B, K_0, e_c, C, D, phi, lambda) => (x, y) => {
  const Harg = (y[1] / e_c - phi) / lambda;
  return [
    A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
    -C * y[1] + D * y[0] * (1 - H(Harg))
  ];
};
const model3 = (A, B, K_0, e_c, C, D, phi, lambda, xi) => (x, y) => {
  const Harg = (y[1] / e_c - phi) / lambda;
  return [
    A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
    -C * y[1] + (xi * y[1] * y[1]) / e_c + D * y[0] * (1 - H(Harg))
  ];
};

const visualizationData = [
  {
    initialData: graph1Data,
    width,
    height,
    smallestY: 0,
    largestY: 100,
    diffEqs: [exponential],
    svgIds: ["vis1"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR],
    integrationConstants: [1]
  },
  {
    initialData: graph2Data,
    width,
    height,
    smallestY: 0,
    largestY: 101,
    diffEqs: [logistic],
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR],
    integrationConstants: [1]
  },
  {
    initialData: graph3Data,
    width,
    height,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model1],
    svgIds: ["model1"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0]
  },
  {
    initialData: graph4Data,
    width,
    height,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model2],
    svgIds: ["model2"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0]
  },
  {
    initialData: graph5Data,
    width,
    height,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model3],
    svgIds: ["model3"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0]
  }
];

export default visualizationData;
