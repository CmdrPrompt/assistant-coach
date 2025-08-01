// src/constants/BlockDiceResults.js

export const BLOCK_DICE_RESULTS = {
  ATTACKER_DOWN: 'Attacker Down', // Skull
  BOTH_DOWN: 'Both Down',
  PUSH: 'Push',
  DEFENDER_STUMBLES: 'Defender Stumbles',
  POW: 'Pow',
};

/**
 * Represents the six faces of a standard Blood Bowl block die.
 * Note that 'Push' appears on two faces.
 * @type {string[]}
 */
export const BLOCK_DIE_FACES = [
  BLOCK_DICE_RESULTS.ATTACKER_DOWN,
  BLOCK_DICE_RESULTS.BOTH_DOWN,
  BLOCK_DICE_RESULTS.PUSH,
  BLOCK_DICE_RESULTS.PUSH,
  BLOCK_DICE_RESULTS.DEFENDER_STUMBLES,
  BLOCK_DICE_RESULTS.POW,
];