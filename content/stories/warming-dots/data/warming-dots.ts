import COLORS from "@/utils/styles";

const POPULATION_COLOR = COLORS.BLUE;
const ENVIRONMENT_COLOR = COLORS.RED;
const width = 800;
const height = 500;

export const graph1Data = [
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "pause",
    title: "Growth rate for the population",
    color: POPULATION_COLOR,
    equationParameter: true,
  },
];

export const graph2Data = [
  ...graph1Data,
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 100,
    maxIcon: "users",
    minIcon: "user",
    title: "Carrying capacity for the environment",
    color: POPULATION_COLOR,
    equationParameter: true,
  },
];

export const graph3Data = [
  ...graph1Data,
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "pause",
    title: "Population growth factor due to harvesting resource",
    color: POPULATION_COLOR,
    equationParameter: true,
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
    equationParameter: true,
  },
  {
    min: 5,
    max: 100,
    initialValue: 10,
    step: 1,
    maxIcon: "tree",
    minIcon: "dizzy",
    title: "Threshold beyond which the environment can't support a population",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
  {
    min: 0.01,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "pause",
    title: "Recovery rate for the environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
  {
    min: 0.01,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "pause",
    title: "Rate at which resource depletion harms the environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
];

export const graph4Data = [
  ...graph3Data,
  {
    min: 0,
    max: 1,
    initialValue: 1,
    maxIcon: "thermometer-full",
    minIcon: "thermometer-empty",
    title: "How much destruction occurs before resource transition?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
  {
    min: 0.01,
    max: 1,
    step: 0.01,
    initialValue: 0,
    maxIcon: "step-forward",
    minIcon: "fast-forward",
    title: "How long does it take to transition between resources?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
];

export const graph5Data = [
  ...graph4Data,
  {
    min: 0,
    max: 10,
    initialValue: 0,
    maxIcon: "dizzy",
    minIcon: "smile",
    title: "How fragile is the environment?",
    color: ENVIRONMENT_COLOR,
    equationParameter: true,
  },
];

const K = (K_0: number, e_c: number, e: number) => K_0 * (1 - e / e_c);
const H = (x: number) => (1 + Math.tanh(x)) / 2;

export const exponential = (A: number) => (x: number, y: number[]) => [A * y[0]];
export const logistic = (A: number, r: number) => (x: number, y: number[]) => [A * y[0] * (1 - y[0] / r)];

export const model1 = (A: number, B: number, K_0: number, e_c: number, C: number, D: number) => (x: number, y: number[]) => [
  A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
  -C * y[1] + D * y[0],
];

export const model2 = (A: number, B: number, K_0: number, e_c: number, C: number, D: number, phi: number, lambda: number) => (x: number, y: number[]) => {
  const Harg = (y[1] / e_c - phi) / lambda;
  return [
    A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
    -C * y[1] + D * y[0] * (1 - H(Harg)),
  ];
};

export const model3 = (A: number, B: number, K_0: number, e_c: number, C: number, D: number, phi: number, lambda: number, xi: number) => (x: number, y: number[]) => {
  const Harg = (y[1] / e_c - phi) / lambda;
  return [
    A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])) + B * y[0],
    -C * y[1] + (xi * y[1] * y[1]) / e_c + D * y[0] * (1 - H(Harg)),
  ];
};

export const visualizationData = [
  {
    initialData: graph1Data,
    width,
    height,
    smallestY: 101,
    largestY: 101,
    diffEqs: [exponential],
    svgIds: ["vis1"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR],
    integrationConstants: [1],
  },
  {
    initialData: graph2Data,
    width,
    height,
    smallestY: 101,
    largestY: 101,
    diffEqs: [logistic],
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR],
    integrationConstants: [1],
  },
  {
    initialData: graph3Data,
    width,
    height: height + 100,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model1],
    svgIds: ["model1"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0],
  },
  {
    initialData: graph4Data,
    width,
    height: height + 150,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model2],
    svgIds: ["model2"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0],
  },
  {
    initialData: graph5Data,
    width,
    height: height + 200,
    smallestY: 0,
    largestY: 1001,
    diffEqs: [model3],
    svgIds: ["model3"],
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR],
    integrationConstants: [1, 0],
  },
];
