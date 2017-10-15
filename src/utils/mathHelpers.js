import * as odex from "odex";

function generateData(min, max, step, initialValues, diffEqValues, diffEq) {
  const s = new odex.Solver(2);
  s.denseOutput = true;
  const data = {
    graph1: [],
    graph2: []
  };
  s.solve(
    diffEq(...diffEqValues),
    min,
    initialValues,
    max,
    s.grid(step, (x, y) => {
      data.graph1.push({ x, y: y[0] });
      data.graph2.push({ x, y: y[1] });
    })
  );
  return data;
}

export { generateData };
