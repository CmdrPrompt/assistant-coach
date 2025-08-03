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
export function getAdjacentPositions({ row, col }, maxRows = 15, maxCols = 26) {
  const positions = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // hoppa över sig själv

      const newRow = row + dr;
      const newCol = col + dc;

      // Kontrollera att positionen är inom spelplanen
      if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
        positions.push({ row: newRow, col: newCol });
      }
    }
  }

  return positions;
}