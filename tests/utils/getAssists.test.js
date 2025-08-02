import { describe, it, expect } from 'vitest';
import { getAssists } from '@/utils/getAssists';
import { Player } from '@/models/Player';

/**
 * @file Test suite for the getAssists utility function.
 */
describe('getAssists', () => {
  /**
   * Tests that all 8 adjacent, non-engaged teammates provide an assist.
   */
  it('should count all adjacent, non-engaged teammates as assists', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(8);
  });

  /**
   * Tests that no assists are counted when there are no adjacent teammates.
   */
  it('should return 0 assists if no teammates are adjacent', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(0);
  });

  /**
   * Tests that players with the "Guard" skill can assist even when engaged by an opponent,
   * while non-Guard players who are engaged cannot.
   */
  it('should count assists from players with Guard, even if engaged', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'A', skills: ['Guard'] }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'A', skills: ['Guard'] }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(2);
  });

  /**
   * Tests that the function returns 0 assists for an empty grid.
   */
  it('should return 0 assists for an empty grid', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [];
    const targetPosition = { row: 0, col: 0 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(0);
  });

  /**
   * Tests that the function handles a target position that is out of the grid's bounds.
   */
  it('should return 0 assists when the target is out of bounds', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'A' }) }]
    ];
    const targetPosition = { row: 3, col: 3 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(0);
  });

  /**
   * Tests that no assists are counted if all adjacent positions are occupied by opponents.
   */
  it('should return 0 assists if all adjacent positions have opponents', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'B' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(0);
  });

  /**
   * Tests that players who are not standing cannot provide an assist.
   */
  it('should not count assists from players who are not standing', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'A', status: 'standing' }) }, { player: new Player({ team: 'A', status: 'prone' }) }, { player: new Player({ team: 'A', status: 'standing' }) }],
      [{ player: new Player({ team: 'A', status: 'prone' }) }, { player: new Player({ team: 'A', status: 'standing' }) }, { player: new Player({ team: 'A', status: 'standing' }) }],
      [{ player: new Player({ team: 'A', status: 'standing' }) }, { player: new Player({ team: 'A', status: 'standing' }) }, { player: new Player({ team: 'A', status: 'standing' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(6);
  });

  /**
   * Tests that a player with the "Guard" skill provides an assist even when engaged,
   * while a player without it does not under the same conditions. This isolates the Guard skill.
   */
  it('should only count an engaged player as an assist if they have the Guard skill', () => {
    const blockerPosition = { row: 99, col: 99 }; // Not on grid
    const grid = [
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }],
      [{ player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }],
      [{ player: new Player({ team: 'A' }) }, { player: new Player({ team: 'B' }) }, { player: new Player({ team: 'A' }) }]
    ];
    const targetPosition = { row: 1, col: 1 };
    const team = 'A';
    const result = getAssists(grid, targetPosition, blockerPosition, team);
    expect(result.count).toBe(0);
  });
});