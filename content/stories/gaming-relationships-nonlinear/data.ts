import type { GamingVisData, SliderDatum } from "@/components/story/shared/GamingRelationships";
import COLORS from "@/utils/styles";

const A = COLORS.ORANGE;
const B = COLORS.GREEN;
const C = COLORS.MAROON;

// Two-person model (same structure as graph2Data from linear, with overridden initial values)
const twoPersonData: SliderDatum[] = [
  { min: -5, max: 5, initialValue: 4, title: "A's Initial Feelings", color: A, equationParameter: false },
  { min: -5, max: 5, initialValue: 3, title: "A's Response to B's Feelings", color: A, equationParameter: true },
  { min: -5, max: 5, initialValue: 1, title: "A's Response to A's Feelings", color: A, equationParameter: true },
  { min: -5, max: 5, initialValue: -2, title: "B's Initial Feelings", color: B, equationParameter: false },
  { min: -5, max: 5, initialValue: -5, title: "B's Response to A's Feelings", color: B, equationParameter: true },
  { min: -5, max: 5, initialValue: -2, title: "B's Response to B's Feelings", color: B, equationParameter: true },
];

// Three-person model (A, B who has feelings for both A and C, and C)
const threePersonData: SliderDatum[] = [
  { min: -5, max: 5, initialValue: 1, title: "A's Initial Feelings", color: A, equationParameter: false },
  { min: -5, max: 5, initialValue: -4, title: "A's Response to B's Feelings for A", color: A, equationParameter: true },
  { min: -5, max: 5, initialValue: 1.1, title: "A's Response to A's Feelings", color: A, equationParameter: true },
  { min: -5, max: 5, initialValue: 1, title: "B's Initial Feelings for A", color: B, equationParameter: false },
  { min: -5, max: 5, initialValue: 3, title: "B's Response to A & C's Feelings", color: B, equationParameter: true },
  { min: -5, max: 5, initialValue: -2, title: "B's Response to B's Feelings", color: B, equationParameter: true },
  { min: -5, max: 5, initialValue: 0, title: "B's Initial Feelings for C", color: B, equationParameter: false },
  { min: -5, max: 5, initialValue: 0, title: "C's Initial Feelings", color: C, equationParameter: false },
  { min: -5, max: 5, initialValue: 1.5, title: "C's Response to B's Feelings for C", color: C, equationParameter: true },
  { min: -5, max: 5, initialValue: -1, title: "C's Response to C's Feelings", color: C, equationParameter: true },
];

// Linear model: A' = a*B(t) + c*A(t),  B' = b*A(t) + d*B(t)
const linearDiffEq = (a: number, b: number, c: number, d: number) => (_x: number, y: number[]) => [
  a * y[1] + b * y[0],
  c * y[0] + d * y[1],
];

// Nonlinear two-person model with intensity dampening
const nonlinearDiffEq2 = (a: number, b: number, c: number, d: number) => (_x: number, y: number[]) => [
  a * y[1] * (1 - Math.abs(y[1])) + b * y[0],
  c * y[0] * (1 - Math.abs(y[0])) + d * y[1],
];

// Three-person chaotic model: y[0]=A, y[1]=B's feelings for A, y[2]=B's feelings for C, y[3]=C
const nonlinearDiffEq3 = (b: number, a: number, c: number, d: number, f: number, e: number) =>
  (_x: number, y: number[]) => [
    a * y[0] + b * y[1] * (1 - Math.abs(y[1])),
    c * (y[0] - y[3]) * (1 - Math.abs(y[0] - y[3])) + d * y[1],
    c * (y[3] - y[0]) * (1 - Math.abs(y[3] - y[0])) + d * y[2],
    e * y[3] + f * y[2] * (1 - Math.abs(y[2])),
  ];

export const nonlinearVisData: GamingVisData[] = [
  {
    initialData: twoPersonData,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [linearDiffEq, nonlinearDiffEq2],
    svgIds: ["vis1", "vis2"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [A, B],
  },
  {
    initialData: threePersonData,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 200,
    diffEqs: [nonlinearDiffEq3, nonlinearDiffEq3],
    svgIds: ["vis3", "vis4"],
    xLabel: "Time",
    yLabel: "Feelings",
    colors: [A, B, B, C],
  },
];
