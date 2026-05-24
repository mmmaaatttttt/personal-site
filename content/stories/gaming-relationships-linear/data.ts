import type {
  GamingVisData,
  SliderDatum,
} from "@/components/story/shared/GamingRelationships";
import COLORS from "@/utils/styles";

const A = COLORS.ORANGE;
const B = COLORS.GREEN;

const graph1Data: SliderDatum[] = [
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Initial Feelings",
    color: A,
    equationParameter: false,
  },
  {
    min: -5,
    max: 5,
    initialValue: -1,
    title: "A's Response to B's Feelings",
    color: A,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: -3,
    title: "B's Initial Feelings",
    color: B,
    equationParameter: false,
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "B's Response to A's Feelings",
    color: B,
    equationParameter: true,
  },
];

const graph2Data: SliderDatum[] = [
  ...graph1Data.slice(0, 2),
  {
    min: -5,
    max: 5,
    initialValue: -0.3,
    title: "A's Response to A's Feelings",
    color: A,
    equationParameter: true,
  },
  ...graph1Data.slice(2),
  {
    min: -5,
    max: 5,
    initialValue: 0,
    title: "B's Response to B's Feelings",
    color: B,
    equationParameter: true,
  },
];

const graph3Data: SliderDatum[] = [
  // A's equation parameters (no initial feelings slider — defaults to 0)
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Response to B's Feelings",
    color: A,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: -5,
    title: "A's Response to A's Feelings",
    color: A,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: 1,
    title: "A's Intrinsic Appeal",
    color: A,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Response to B's Intrinsic Appeal",
    color: A,
    equationParameter: true,
  },
  // B's equation parameters
  {
    min: -5,
    max: 5,
    initialValue: 2,
    title: "B's Response to A's Feelings",
    color: B,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: -5,
    title: "B's Response to B's Feelings",
    color: B,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: 4,
    title: "B's Intrinsic Appeal",
    color: B,
    equationParameter: true,
  },
  {
    min: -5,
    max: 5,
    initialValue: 2,
    title: "B's Response to A's Intrinsic Appeal",
    color: B,
    equationParameter: true,
  },
];

// A' = a*B(t),  B' = b*A(t)
const diffEq1 = (a: number, b: number) => (_x: number, y: number[]) => [
  a * y[1],
  b * y[0],
];

// A' = a*B(t) + c*A(t),  B' = b*A(t) + d*B(t)
const diffEq2 =
  (a: number, b: number, c: number, d: number) => (_x: number, y: number[]) => [
    a * y[1] + b * y[0],
    c * y[0] + d * y[1],
  ];

// A' = a*B(t) + c*A(t) + e*B_appeal,  B' = b*A(t) + d*B(t) + f*A_appeal
const diffEq3 =
  (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
  ) =>
  (_x: number, y: number[]) => [
    a * y[1] + b * y[0] + d * g,
    e * y[0] + f * y[1] + h * c,
  ];

export const linearVisData: GamingVisData[] = [
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
    colors: [A, B],
  },
  {
    initialData: graph2Data,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [diffEq2],
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [A, B],
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
    colors: [A, B],
  },
];
