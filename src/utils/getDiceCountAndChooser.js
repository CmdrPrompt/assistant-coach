// src/utils/getDiceCountAndChooser.js

/**
 * Determines the number of block dice and which player chooses the result based on strength comparison.
 *
 * @param {number} blockerStrength - The total strength of the blocking player, including assists.
 * @param {number} targetStrength - The total strength of the target player, including assists.
 * @returns {{diceCount: number, chooser: 'blocker'|'target'}} An object containing the number of dice and the choosing player.
 */
export function getDiceCountAndChooser(blockerStrength, targetStrength) {
  if (blockerStrength >= 2 * targetStrength) {
    return { diceCount: 3, chooser: 'blocker' };
  }
  if (blockerStrength > targetStrength) {
    return { diceCount: 2, chooser: 'blocker' };
  }
  if (blockerStrength === targetStrength) {
    return { diceCount: 1, chooser: 'blocker' };
  }
  // From here, we know targetStrength > blockerStrength
  if (targetStrength >= 2 * blockerStrength) {
    return { diceCount: 3, chooser: 'target' };
  }
  // The only remaining case is targetStrength > blockerStrength but not double or more.
  return { diceCount: 2, chooser: 'target' };
}