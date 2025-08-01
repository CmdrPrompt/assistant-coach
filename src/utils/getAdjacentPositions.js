// utils/getAdjacentPositions.js

/**
 * Calculates and returns the coordinates of all 8 squares adjacent to a given position.
 * This includes the diagonal positions.
 *
 * @param {object} position - The central position.
 * @param {number} position.row - The row of the central position.
 * @param {number} position.col - The column of the central position.
 * @returns {Array<object>} An array of 8 position objects, each with `row` and `col` properties.
 */
export function getAdjacentPositions({ row, col }) {
  const positions = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      // Skip the center position itself
      if (dr === 0 && dc === 0) continue;
      positions.push({ row: row + dr, col: col + dc });
    }
  }

  return positions;
}