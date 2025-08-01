import { describe, it, expect } from 'vitest';
import { Player } from '@/models/Player';

/**
 * @file Test suite for the Player model.
 */
describe('Player', () => {
  /**
   * Tests that a Player object is initialized with the correct properties.
   */
  it('should initialize with correct properties', () => {
    const player = new Player({ id: 1, name: 'John', team: 'A', strength: 10, skills: ['shooting'] });
    expect(player.id).toBe(1);
    expect(player.name).toBe('John');
    expect(player.team).toBe('A');
    expect(player.strength).toBe(10);
    expect(player.skills).toEqual(['shooting']);
  });

  /**
   * Tests the hasSkill method for both existing and non-existing skills.
   */
  it('should correctly check for skill existence', () => {
    const player = new Player({ id: 1, name: 'John', team: 'A', strength: 10, skills: ['shooting'] });
    expect(player.hasSkill('shooting')).toBe(true);
    expect(player.hasSkill('dribbling')).toBe(false);
  });

  /**
   * Tests the isOpposing method with players from different teams.
   */
  it('should return true when players are on opposing teams', () => {
    const player1 = new Player({ id: 1, name: 'John', team: 'A', strength: 10, skills: [] });
    const player2 = new Player({ id: 2, name: 'Doe', team: 'B', strength: 8, skills: [] });
    expect(player1.isOpposing(player2)).toBe(true);
  });

  /**
   * Tests that the skills property defaults to an empty array if not provided.
   */
  it('should default to an empty skills array', () => {
    const player = new Player({ id: 1, name: 'John', team: 'A', strength: 10 });
    expect(player.skills).toEqual([]);
  });

  /**
   * Tests that isOpposing returns false when the other player is null or undefined.
   */
  it('should not be opposing a null or undefined player', () => {
    const player = new Player({ id: 1, name: 'John', team: 'A', strength: 10, skills: [] });
    expect(player.isOpposing(undefined)).toBe(false);
    expect(player.isOpposing(null)).toBe(false);
  });

  /**
   * Tests that the team property is undefined if not provided during initialization.
   */
  it('should have an undefined team if not provided', () => {
    const player = new Player({ id: 1, name: 'John', strength: 10, skills: ['shooting'] });
    expect(player.team).toBeUndefined();
  });

  /**
   * Tests that the status property defaults to 'standing' and can be set.
   */
  it('should handle player status correctly', () => {
    const standingPlayer = new Player({ id: 1, team: 'A' });
    const pronePlayer = new Player({ id: 2, team: 'A', status: 'prone' });
    const stunnedPlayer = new Player({ id: 3, team: 'A', status: 'stunned' });

    // Default status
    expect(standingPlayer.status).toBe('standing');
    expect(standingPlayer.isStanding()).toBe(true);
    expect(standingPlayer.isProne()).toBe(false);

    // Prone status
    expect(pronePlayer.isProne()).toBe(true);
    expect(pronePlayer.isStanding()).toBe(false);

    // Stunned status
    expect(stunnedPlayer.isStunned()).toBe(true);
    expect(stunnedPlayer.isStanding()).toBe(false);
  });
});