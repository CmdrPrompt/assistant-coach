// src/utils/getDiceCountAndChooser.js

/**
 * Determines the number of block dice and which player chooses the result based on strength comparison.
 *
 * @param {number} blockerStrength - The total strength of the blocking player, including assists.
 * @param {number} targetStrength - The total strength of the target player, including assists.
 * @returns {{diceCount: number, chooser: 'blocker'|'target'}} An object containing the number of dice and the choosing player.
 */
export function getDiceCountAndChooser(blockerStrength, targetStrength) {
  // Clarified rules:
  // - If both players have the same strength, 1 die, stronger player chooses (but both are equal)
  // - If one player has higher strength, 2 dice, stronger player chooses
  // - If one player has more than double strength, 3 dice, stronger player chooses
  if (blockerStrength === targetStrength) {
    return { diceCount: 1, chooser: 'blocker' };
  }
  if (blockerStrength > targetStrength) {
    if (blockerStrength > 2 * targetStrength) {
      return { diceCount: 3, chooser: 'blocker' };
    }
    return { diceCount: 2, chooser: 'blocker' };
  }
  if (targetStrength > blockerStrength) {
    if (targetStrength > 2 * blockerStrength) {
      return { diceCount: 3, chooser: 'target' };
    }
    return { diceCount: 2, chooser: 'target' };
  }
}