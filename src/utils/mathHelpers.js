import * as odex from "odex";

function generateData(A, B, x0, y0, min, max, step) {
  var s = new odex.Solver(2);
  s.denseOutput = true;
  function relationship1(a, b) {
    return (x, y) => [a * y[1], b * y[0]];
  }
  var data = {
    graph1: [],
    graph2: []
  };
  s.solve(
    relationship1(A, B),
    min,
    [x0, y0],
    max,
    s.grid(step, function(x, y) {
      data.graph1.push({ x, y: y[0] });
      data.graph2.push({ x, y: y[1] });
    })
  );
  return data;
}

export { generateData };
