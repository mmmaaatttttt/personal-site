const PERSON_A_COLOR = "#FF8E5E";
const PERSON_B_COLOR = "#52A081";
const initialData = [
  {
    min: -5,
    max: 5,
    initialValue: 3,
    title: "A's Initial Feelings",
    id: "0|0",
    color: PERSON_A_COLOR
  },
  {
    min: -3,
    max: 3,
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
    min: -3,
    max: 3,
    initialValue: 1,
    title: "B's Response to A's Feelings",
    id: "1|1",
    color: PERSON_B_COLOR
  }
];

const diffEq1 = (a, b) => (x, y) => [a * y[1], b * y[0]];

const visualizationData = [
  {
    initialData,
    width: 800,
    height: 600,
    smallestY: 5,
    largestY: 100,
    diffEq: diffEq1
  }
];

export default visualizationData;
