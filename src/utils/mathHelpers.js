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
  return pts.reduce((sum, pt) => sum + pt ** 2, 0) ** (1 / 2);
}

export { generateData, choices, euclideanDistance };
