import { describe, it, expect } from 'vitest';
import { isAdjacentToOpponent } from '@/utils/isAdjacentToOpponent';
import { getAdjacentPositions } from '@/utils/getAdjacentPositions';
import { Player } from '@/models/Player';

/**
 * @file Test suite for the isAdjacentToOpponent utility function.
 */
describe('isAdjacentToOpponent', () => {
  it('should confirm B4 cannot attack A1 but can attack A4 in the 7x7 grid scenario', () => {
    // Set up the grid as described
    const grid = Array.from({ length: 7 }, () => Array(7).fill(null));
    // Place A1 at (1,2), A2 at (2,2), A3 at (3,2), A4 at (4,2)
    grid[1][2] = { player: new Player({ team: 'A', number: 1 }) };
    grid[2][2] = { player: new Player({ team: 'A', number: 2 }) };
    grid[3][2] = { player: new Player({ team: 'A', number: 3 }) };
    grid[4][2] = { player: new Player({ team: 'A', number: 4 }) };
    // Place B1 at (2,3), B2 at (3,3), B3 at (4,3), B4 at (5,3)
    grid[2][3] = { player: new Player({ team: 'B', number: 1 }) };
    grid[3][3] = { player: new Player({ team: 'B', number: 2 }) };
    grid[4][3] = { player: new Player({ team: 'B', number: 3 }) };
    grid[5][3] = { player: new Player({ team: 'B', number: 4 }) };
    // B4 at (5,3) should NOT be adjacent to A1 at (1,2)
    const posB4 = { row: 5, col: 3 };
    const ownTeamB = 'B';
    expect(isAdjacentToOpponent(grid, posB4, ownTeamB)).toBe(true); // B4 is adjacent to A4
    // Specifically check adjacency between B4 and A1
    const adjacentB4 = getAdjacentPositions(posB4, 7, 7);
    const isA1Adjacent = adjacentB4.some(pos => pos.row === 1 && pos.col === 2);
    expect(isA1Adjacent).toBe(false);
    // Specifically check adjacency between B4 and A4
    const isA4Adjacent = adjacentB4.some(pos => pos.row === 4 && pos.col === 2);
    expect(isA4Adjacent).toBe(true);
  });
  it('should NOT allow B4 to attack A1 in the 7x7 grid scenario', () => {
    // Set up the grid as described
    const grid = Array.from({ length: 7 }, () => Array(7).fill(null));
    // Place A1 at (1,2), A4 at (4,2), B4 at (5,3)
    grid[1][2] = { player: new Player({ team: 'A', number: 1 }) };
    grid[4][2] = { player: new Player({ team: 'A', number: 4 }) };
    grid[5][3] = { player: new Player({ team: 'B', number: 4 }) };
    // B4 position
    const positionB4 = { row: 5, col: 3 };
    // B4 should NOT be adjacent to A1
    expect(isAdjacentToOpponent(grid, positionB4, 'B')).toBe(true); // Should be true because A4 is adjacent
    // Specifically test adjacency between B4 and A1
    const adjacentB4 = getAdjacentPositions(positionB4, 7, 7);
    const isA1Adjacent = adjacentB4.some(pos => pos.row === 1 && pos.col === 2);
    expect(isA1Adjacent).toBe(false);
    // Should be adjacent to A4
    const isA4Adjacent = adjacentB4.some(pos => pos.row === 4 && pos.col === 2);
    expect(isA4Adjacent).toBe(true);
  });
  it('should return false for a player in the top-left corner with no adjacent opponents', () => {
    const grid = Array.from({ length: 7 }, () => Array(7).fill(null));
    grid[0][0] = { player: new Player({ team: 'A', number: 1 }) };
    const position = { row: 0, col: 0 };
    const ownTeam = 'A';
    expect(isAdjacentToOpponent(grid, position, ownTeam)).toBe(false);
  });

  it('should not check out-of-bounds positions for a player in the bottom-right corner', () => {
    const grid = Array.from({ length: 7 }, () => Array(7).fill(null));
    grid[6][6] = { player: new Player({ team: 'B', number: 4 }) };
    const position = { row: 6, col: 6 };
    const ownTeam = 'B';
    expect(isAdjacentToOpponent(grid, position, ownTeam)).toBe(false);
  });

  it('should correctly identify adjacency in a custom 7x7 grid scenario (A1 and B3)', () => {
    // Set up the grid as described
    const grid = Array.from({ length: 7 }, () => Array(7).fill(null));
    // Place A1 at (1,2), B3 at (4,3)
    grid[1][2] = { player: new Player({ team: 'A', number: 1 }) };
    grid[2][2] = { player: new Player({ team: 'A', number: 2 }) };
    grid[3][2] = { player: new Player({ team: 'A', number: 3 }) };
    grid[4][2] = { player: new Player({ team: 'A', number: 4 }) };
    grid[2][3] = { player: new Player({ team: 'B', number: 1 }) };
    grid[3][3] = { player: new Player({ team: 'B', number: 2 }) };
    grid[4][3] = { player: new Player({ team: 'B', number: 3 }) };
    grid[5][3] = { player: new Player({ team: 'B', number: 4 }) };
    // Test if A1 (1,2) is adjacent to B3 (4,3)
    // They are not adjacent: A1's adjacent squares are (0,1)-(2,3), none match (4,3)
    const positionA1 = { row: 1, col: 2 };
    const ownTeamA = 'A';
    expect(isAdjacentToOpponent(grid, positionA1, ownTeamA)).toBe(true); // Should be true because B1 is adjacent
    // Specifically test adjacency between A1 and B3
    // A1 (1,2) and B3 (4,3) are not adjacent
    const adjacentA1 = getAdjacentPositions(positionA1, 7, 7);
    const isB3Adjacent = adjacentA1.some(pos => pos.row === 4 && pos.col === 3);
    expect(isB3Adjacent).toBe(false);
  });
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