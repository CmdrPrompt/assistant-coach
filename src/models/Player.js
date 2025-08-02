


/**
 * @file Defines the Player class.
 */

/**
 * Represents a player in the game.
 */
export class Player {
  /**
   * Checks if a player is a Guard (for assist logic).
   * @param {Player} player
   * @returns {boolean}
   */
  static isGuard(player) {
    // Case-insensitive kontroll för Guard
    if (!player) return false;
    if (typeof player.hasSkill === 'function' && player.hasSkill('guard')) return true;
    if (Array.isArray(player.skills)) {
      return player.skills.some(skill => skill.toLowerCase() === 'guard');
    }
    return false;
  }
  /**
   * @param {object} props - The properties for the player.
   * @param {number} props.id - The unique identifier for the player.
   * @param {string} props.name - The name of the player.
   * @param {string} props.team - The team identifier for the player.
   * @param {string} props.position - The position of the player (e.g., Lineman, Blitzer).
   * @param {number} props.strength - The strength value of the player.
   * @param {string[]} [props.skills=[]] - An array of skills the player possesses.
   * @param {'standing'|'prone'|'stunned'} [props.status='standing'] - The current status of the player.
   */
constructor({ id, name, team, position, strength, skills = [], status = 'standing', cost, ma, st, ag, pa, av, normal, double, reRoll }) {
    /** @type {number} */
    this.id = id;
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.team = team;
    /** @type {string} */
    this.position = position;
    /** @type {number} */
    this.strength = Number(st ?? strength);
    /** @type {string[]} */
    this.skills = skills ? skills : [];
    /** @type {'standing'|'prone'|'stunned'} */
    this.status = status ? status : 'standing';
    /** @type {number|string} */
    this.cost = cost;
    /** @type {number|string} */
    this.movement = Number(ma);
    /** @type {number|string} */
    this.agility = Number(ag);
    /** @type {number|string} */
    this.passing = Number(pa);
    /** @type {number|string} */
    this.armor = Number(av);
    /** @type {string} */
    this.normal = normal;
    /** @type {string} */
    this.double = double;
    /** @type {string|number} */
    this.reRoll = reRoll;
  }

  /**
   * Checks if the player has a specific skill.
   * @param {string} skillName - The name of the skill to check for.
   * @returns {boolean} True if the player has the skill, otherwise false.
   */
  hasSkill(skillName) {
    // Case-insensitive kontroll för skills
    if (!skillName) return false;
    return this.skills.some(skill => skill.toLowerCase() === skillName.toLowerCase());
  }

  /**
   * Checks if another player is on an opposing team.
   * @param {Player | null | undefined} otherPlayer - The player to compare against.
   * @returns {boolean} True if the other player exists and is on a different team.
   */
  isOpposing(otherPlayer) {
    return !!otherPlayer && this.team !== otherPlayer.team;
  }

  /**
   * Checks if the player is standing.
   * @returns {boolean} True if the player's status is 'standing'.
   */
  isStanding() {
    return this.status === 'standing';
  }

  /**
   * Checks if the player is prone.
   * @returns {boolean} True if the player's status is 'prone'.
   */
  isProne() {
    return this.status === 'prone';
  }

  /**
   * Checks if the player is stunned.
   * @returns {boolean} True if the player's status is 'stunned'.
   */
  isStunned() {
    return this.status === 'stunned';
  }
}