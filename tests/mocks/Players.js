/**
 * Creates a mock player object for testing purposes.
 * @param {string} team - The team identifier ('A' or 'B').
 * @param {object} [options={}] - Optional player attributes.
 * @param {number} [options.strength=5] - The player's strength.
 * @param {string[]} [options.skills=[]] - An array of player skills.
 * @returns {{team: string, strength: number, skills: string[]}} A player object.
 */
export const createPlayer = (team, { strength = 5, skills = [] } = {}) => ({
  team,
  strength,
  skills,
});