export function countRegions(
  segments: boolean[][],
  rowCount: number,
  colCount: number
): [number, number][][] {
  const visited = Array.from({ length: rowCount }, () => Array<boolean>(colCount).fill(false));
  const districts: [number, number][][] = [];

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      if (!visited[r][c]) {
        districts.push(bfsArea(segments, visited, rowCount, colCount, r, c));
      }
    }
  }
  return districts;
}

function bfsArea(
  segments: boolean[][],
  visited: boolean[][],
  rowCount: number,
  colCount: number,
  startRow: number,
  startCol: number
): [number, number][] {
  const district: [number, number][] = [];
  const queue: [number, number][] = [[startRow, startCol]];

  while (queue.length > 0) {
    const cell = queue.shift()!;
    const [row, col] = cell;
    if (visited[row][col]) continue;
    visited[row][col] = true;
    district.push([row, col]);

    if (row > 0 && !visited[row - 1][col] && !segments[2 * row - 1][col]) {
      queue.push([row - 1, col]);
    }
    if (col + 1 < colCount && !visited[row][col + 1] && !segments[2 * row][col]) {
      queue.push([row, col + 1]);
    }
    if (row + 1 < rowCount && !visited[row + 1][col] && !segments[2 * row + 1][col]) {
      queue.push([row + 1, col]);
    }
    if (col > 0 && !visited[row][col - 1] && !segments[2 * row][col - 1]) {
      queue.push([row, col - 1]);
    }
  }

  return district;
}
