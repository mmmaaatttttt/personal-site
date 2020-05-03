/**
 * Determine districts based on which lines have been clicked on.
 * @param {number} rowCount - length of a row
 * @param {number} colCount - length of a column
 * @param {Array<Array<boolean>>} segments - Keep track of current district lines
 */
export function countDistricts(rowCount, colCount, segments) {
  const visitedYet = Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }).fill(false)
  );
  const newDistricts = [];
  visitedYet.forEach((row, rowIdx) => {
    row.forEach((isVisited, colIdx) => {
      if (!isVisited) {
        newDistricts.push(
          _calcAreaBST(visitedYet, [[rowIdx, colIdx]], segments)
        );
      }
    });
  });
  return newDistricts;
}

/**
 * Count the number of blue squares in a district
 * @param {Array<Array>} district - Array of array of coordinates corresponding to cells in the district
 * @return number of blue squares in the district
 */
export function blueCount(district) {
  return district.filter(d => d[0] % 2 === 0).length;
}

/**
 * Count the number of red squares in a district
 * @param {Array<Array>} district - Array of array of coordinates corresponding to cells in the district
 * @return number of red squares in the district
 */
export function redCount(district) {
  return district.filter(d => d[0] % 2 === 1).length;
}


/**
 * Take the district map and count how many squares lie within a district.
 * Uses BST to navigate through the district to find its size.
 * @param {Array<Array<boolean>>} visitedYet - Keeping track of which cells have been visited for BST
 * @param {Array<Array<number>>} whereToLook - queue of coordinates to manage BST
 * @param {Array<Array<boolean>>} segments - Keep track of current district lines
 * @returns {Array} array of coordinates for cells in the district
 */
function _calcAreaBST(visitedYet, whereToLook, segments) {
  let district = [];
  while (whereToLook.length > 0) {
    let [row, col] = whereToLook.shift();
    if (visitedYet[row][col] === false) {
      visitedYet[row][col] = true;
      district.push([row, col]);
      let shouldMoveUp =
        visitedYet[row - 1] !== undefined &&
        visitedYet[row - 1][col] === false &&
        segments[2 * row - 1][col] === false;
      let shouldMoveRight =
        visitedYet[row][col + 1] !== undefined &&
        visitedYet[row][col + 1] === false &&
        segments[2 * row][col] === false;
      let shouldMoveDown =
        visitedYet[row + 1] !== undefined &&
        visitedYet[row + 1][col] === false &&
        segments[2 * row + 1][col] === false;
      let shouldMoveLeft =
        visitedYet[row][col - 1] !== undefined &&
        visitedYet[row][col - 1] === false &&
        segments[2 * row][col - 1] === false;
      if (shouldMoveUp) whereToLook.push([row - 1, col]);
      if (shouldMoveRight) whereToLook.push([row, col + 1]);
      if (shouldMoveDown) whereToLook.push([row + 1, col]);
      if (shouldMoveLeft) whereToLook.push([row, col - 1]);
    }
  }
  return district;
}
