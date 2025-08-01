// src/utils/applyBlockDiceResult.js

import { BLOCK_DICE_RESULTS } from '@/constants/BlockDiceResults';

/**
 * Applies the result of a block dice roll, considering player skills.
 *
 * @param {string} chosenResult - The chosen result from the block dice (e.g., 'Push', 'Defender Stumbles').
 * @param {import('@/models/Player').Player} blocker - The player performing the block.
 * @param {import('@/models/Player').Player} target - The player being blocked.
 * @returns {{ finalOutcome: string, description: string }} An object describing the final outcome.
 */
export function applyBlockDiceResult(chosenResult, blocker, target) {
  switch (chosenResult) {
    case BLOCK_DICE_RESULTS.BOTH_DOWN: {
      const hasBlockerBlock = blocker.hasSkill('Block');
      const hasTargetBlock = target.hasSkill('Block');
      const hasBlockerWrestle = blocker.hasSkill('Wrestle');
      const hasTargetWrestle = target.hasSkill('Wrestle');

      if (hasBlockerBlock && !hasTargetBlock) {
        return {
          finalOutcome: 'Target Down',
          description: `${blocker.name} uses Block. ${target.name} is Knocked Down.`,
        };
      }
      if (!hasBlockerBlock && hasTargetBlock) {
        return {
          finalOutcome: 'Attacker Down',
          description: `${target.name} uses Block. ${blocker.name} is Knocked Down.`,
        };
      }
      if (hasBlockerBlock && hasTargetBlock) {
        return {
          finalOutcome: 'Standoff',
          description: 'Both players use Block. No one is Knocked Down.',
        };
      }
      // Neither player has the Block skill, check for Wrestle.
      if (hasBlockerWrestle || hasTargetWrestle) {
        return {
          finalOutcome: 'Both Prone',
          description: 'A player with Wrestle is involved. Both players are Placed Prone.',
        };
      }
      // Neither has Block or Wrestle.
      return {
        finalOutcome: 'Both Down',
        description: 'Neither player has Block or Wrestle. Both players are Knocked Down.',
      };
    }
    case BLOCK_DICE_RESULTS.DEFENDER_STUMBLES: {
      const hasDodge = target.hasSkill('Dodge');
      const hasTackle = blocker.hasSkill('Tackle');

      if (hasDodge && !hasTackle) {
        return {
          finalOutcome: 'Push',
          description: `${target.name} uses Dodge to avoid falling. The result is a Push.`,
        };
      }
      return {
        finalOutcome: 'Knocked Down',
        description: hasTackle ? `${blocker.name}'s Tackle negates ${target.name}'s Dodge. Target is Knocked Down.` : `${target.name} is Knocked Down.`,
      };
    }

    default:
      return {
        finalOutcome: chosenResult,
        description: `The result is a ${chosenResult}.`,
      };
  }
}