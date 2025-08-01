import { describe, it, expect } from 'vitest';
import { isAdjacentToOpponent } from '@/utils/isAdjacentToOpponent';
import { Player } from '@/models/Player';

/**
 * @file Test suite for the isAdjacentToOpponent utility function.
 */
describe('isAdjacentToOpponent', () => {
  /**
   * Tests that the function returns true when a player is adjacent to an opponent.
   */
  it('should return true when adjacent to an opponent', () => {
    const grid = [
      [null, { player: new Player({ team: 'B' }) }, null],
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, null, null],
    ];
    const position = { row: 1, col: 1 }; // Player A's position
    const ownTeam = 'A';
    const result = isAdjacentToOpponent(grid, position, ownTeam);
    expect(result).toBe(true);
  });

  /**
   * Tests that the function returns false when a player is not adjacent to any opponent.
   */
  it('should return false when not adjacent to any opponent', () => {
    const grid = [
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, null, { player: new Player({ team: 'A' }) }], // Changed opponent to teammate
    ];
    const position = { row: 1, col: 1 }; // Player A's position
    const ownTeam = 'A';
    const result = isAdjacentToOpponent(grid, position, ownTeam);
    expect(result).toBe(false);
  });

  /**
   * Tests that the function correctly ignores a specified opponent.
   */
  it('should return false when the only adjacent opponent is ignored', () => {
    const grid = [
      [null, { player: new Player({ team: 'B' }) }, null],
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, null, null],
    ];
    const position = { row: 1, col: 1 }; // Player A's position
    const ownTeam = 'A';
    const ignoredOpponentPos = { row: 0, col: 1 };
    const result = isAdjacentToOpponent(grid, position, ownTeam, ignoredOpponentPos);
    expect(result).toBe(false);
  });

  /**
   * Tests that the function returns true if there are other opponents besides the ignored one.
   */
  it('should return true when adjacent to another opponent besides the ignored one', () => {
    const grid = [
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }, null],
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, null, null],
    ];
    const position = { row: 1, col: 1 }; // Player A's position
    const ownTeam = 'A';
    const ignoredOpponentPos = { row: 0, col: 1 }; // One of Player B's position
    const result = isAdjacentToOpponent(grid, position, ownTeam, ignoredOpponentPos);
    expect(result).toBe(true);
  });

  /**
   * Tests that the function returns false for a player on an empty grid.
   */
  it('should return false for a player on an empty grid', () => {
    const grid = [
      [null, null, null],
      [null, { player: new Player({ team: 'A' }) }, null],
      [null, null, null],
    ];
    const position = { row: 1, col: 1 };
    const ownTeam = 'A';
    expect(isAdjacentToOpponent(grid, position, ownTeam)).toBe(false);
  });

  /**
   * Tests that the function handles positions on the edge of the grid correctly.
   */
  it('should work correctly for a player on the edge of the grid', () => {
    const grid = [
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }],
      [null, null],
    ];
    const position = { row: 0, col: 0 }; // Player A's position
    const ownTeam = 'A';
    expect(isAdjacentToOpponent(grid, position, ownTeam)).toBe(true);
  });

  /**
   * Tests that the function returns false when adjacent only to teammates.
   */
  it('should return false when only adjacent to teammates', () => {
    const grid = [
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
    ];
    const position = { row: 1, col: 1 };
    const ownTeam = 'A';
    expect(isAdjacentToOpponent(grid, position, ownTeam)).toBe(false);
  });
});