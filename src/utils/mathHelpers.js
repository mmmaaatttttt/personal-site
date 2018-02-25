import * as odex from "odex";

function generateData(
  count,
  min,
  max,
  step,
  initialValues,
  diffEqValues,
  diffEq
) {
  const s = new odex.Solver(count);
  s.denseOutput = true;
  const data = Array.from({ length: count }, () => []);
  s.solve(
    diffEq(...diffEqValues),
    min,
    initialValues,
    max,
    s.grid(step, (x, y) => {
      data.forEach((arr, i) => {
        arr.push({ x, y: y[i] });
      });
    })
  );
  return data;
}

function choices(arr, num) {
  const values = new Set();
  while (values.size < num) {
    const randomIdx = Math.floor(Math.random() * arr.length);
    values.add(arr[randomIdx]);
  }
  return Array.from(values);
}

function euclideanDistance(...pts) {
  return pts.reduce((sum, pt) => sum + pt ** 2, 0) ** (1 / 2) || 0;
}

const average = (nums, accessor) => {
  if (!nums.length) return 0;
  if (!accessor) accessor = num => num;
  const total = nums.reduce((sum, cur) => sum + accessor(cur), 0);
  return total / nums.length;
};

export { generateData, choices, euclideanDistance, average };
