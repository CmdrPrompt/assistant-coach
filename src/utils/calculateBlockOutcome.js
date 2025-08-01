// src/utils/calculateBlockOutcome.js

import { getAssists } from '@/utils/getAssists';
import { getDiceCountAndChooser } from '@/utils/getDiceCountAndChooser';

/**
 * Calculates the outcome of a block action based on Blood Bowl rules.
 * This function determines the number of block dice and who chooses the result.
 * It returns an object with the block details or an error if the block is invalid.
 * @returns {{diceCount: number, chooser: 'blocker'|'target', blockerStrength: number, targetStrength: number, blockerAssists: number, targetAssists: number, error: null} | {error: string}}
 */
export function calculateBlockOutcome(grid, blockerPos, targetPos) {
  const blocker = grid?.[blockerPos.row]?.[blockerPos.col]?.player;
  const target = grid?.[targetPos.row]?.[targetPos.col]?.player;

  if (!blocker || !target) {
    return {
      error: 'Missing blocker or target player on the grid',
    };
  }

  if (blocker.team === target.team) {
    return {
      error: 'Players are on the same team — blocking teammates is not allowed',
    };
  }

  const blockerAssistsInfo = getAssists(grid, targetPos, blockerPos, blocker.team);
  const targetAssistsInfo = getAssists(grid, blockerPos, targetPos, target.team);

  const blockerStrength = blocker.strength + blockerAssistsInfo.count;
  const targetStrength = target.strength + targetAssistsInfo.count;

  const { diceCount, chooser } = getDiceCountAndChooser(blockerStrength, targetStrength);

  return {
    diceCount,
    chooser,
    blockerStrength,
    targetStrength,
    blockerAssists: blockerAssistsInfo.count,
    targetAssists: targetAssistsInfo.count,
    blockerAssistingPlayers: blockerAssistsInfo.players,
    targetAssistingPlayers: targetAssistsInfo.players,
    error: null,
  };
}
