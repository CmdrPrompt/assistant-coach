// utils/getAssists.js

import { getAdjacentPositions } from '@/utils/getAdjacentPositions';
import { isAdjacentToOpponent } from '@/utils/isAdjacentToOpponent';
import { Player } from '@/models/Player';

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

    if (canAssist(player, grid, pos, team, targetPosition)) {
      count++;
      players.push({
        player: player,
        position: { ...pos },
        reason: player.hasSkill && player.hasSkill('Guard') ? 'Guard skill' : 'Not engaged'
      });
    }
  }

  return { count, players };
}

function canAssist(player, grid, pos, team, targetPosition) {
  // Om spelaren har Guard får hen alltid assistera
  if (Player.isGuard(player)) {
    return true;
  }
  // Annars: kontrollera om hen är markerad av motståndare
  return !isAdjacentToOpponent(grid, pos, team, targetPosition);
}
