// utils/isAdjacentToOpponent.js
import { getAdjacentPositions } from '@/utils/getAdjacentPositions';

/**
 * Checks if a player at a given position is adjacent to any opponent player.
 * This is useful for determining if a player is "engaged" with an opponent,
 * which can affect the calculation of assists in a block action.
 *
 * @param {Array<Array<{player: object|null}>>} grid The game grid, a 2D array where each cell can contain a player object.
 * @param {{row: number, col: number}} pos The position of the player to check.
 * @param {string} ownTeam The team identifier for the player making the check.
 * @param {{row: number, col: number}} [ignoredOpponentPos=null] A specific opponent position to ignore when checking for engagement.
 * @returns {boolean} Returns true if an opponent is in an adjacent square, otherwise false.
 */
export function isAdjacentToOpponent(grid, pos, ownTeam, ignoredOpponentPos = null) {
  const adjacent = getAdjacentPositions(pos);

  for (let neighbor of adjacent) {
    if (
      ignoredOpponentPos &&
      neighbor.row === ignoredOpponentPos.row &&
      neighbor.col === ignoredOpponentPos.col
    ) {
      continue;
    }
    const player = grid?.[neighbor.row]?.[neighbor.col]?.player;
    if (!player) continue;
    if (player.team !== ownTeam) return true;
  }

  return false;
}