// utils/getAssists.js

import { getAdjacentPositions } from '@/utils/getAdjacentPositions';
import { isAdjacentToOpponent } from '@/utils/isAdjacentToOpponent';

/**
 * Calculates the number of assisting players for a block or foul action.
 * Only standing, friendly players adjacent to the target who are not engaged
 * with an opponent can assist. Players with the "Guard" skill can assist
 * even if they are engaged.
 *
 * @param {Array<Array<{player: object|null}>>} grid The game grid.
 * @param {{row: number, col: number}} targetPosition The position of the player being targeted.
 * @param {{row: number, col: number}} blockerPosition The position of the player making the block (to exclude them from assists).
 * @param {string} team The team identifier for the assisting players.
 * @returns {{count: number, players: Array<{player: object, position: {row: number, col: number}, reason: string}>}} 
 *          Object containing the total number of assists and information about the assisting players.
 */
export function getAssists(grid, targetPosition, blockerPosition, team) {
  const assistPositions = getAdjacentPositions(targetPosition);
  let count = 0;
  const players = [];

  for (let pos of assistPositions) {
    // An assisting player cannot be the blocker themselves.
    if (pos.row === blockerPosition.row && pos.col === blockerPosition.col) {
      continue;
    }

    const player = grid?.[pos.row]?.[pos.col]?.player;
    if (!player) continue;
    if (player.team !== team) continue;

    if (!player.isStanding()) continue;

    const isEngaged = isAdjacentToOpponent(grid, pos, team, targetPosition);
    if (!isEngaged || player.hasSkill('Guard')) {
      count++;
      
      // Add player to the list of assisting players
      players.push({
        player: player,
        position: { ...pos },
        reason: player.hasSkill('Guard') && isEngaged ? 'Guard skill' : 'Not engaged'
      });
    }
  }

  return { count, players };
}
