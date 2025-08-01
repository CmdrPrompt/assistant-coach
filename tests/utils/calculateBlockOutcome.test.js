import { describe, it, expect } from 'vitest';
import { calculateBlockOutcome } from '@/utils/calculateBlockOutcome';
import { Player } from '@/models/Player';

/**
 * @file Test suite for the calculateBlockOutcome utility function.
 */
describe('calculateBlockOutcome', () => {
  /**
   * Tests that the blocker gets 3 dice when their strength is at least double the target's.
   */
  it('should give 3 dice to the blocker when their strength is double the target', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 10 }) }, null],
      [null, { player: new Player({ team: 'B', strength: 4 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 3,
      chooser: 'blocker',
      blockerStrength: 10,
      targetStrength: 4,
      blockerAssists: 0,
      targetAssists: 0,
      error: null,
    });
  });

  /**
   * Tests that the blocker gets 2 dice when their strength is higher than the target's.
   */
  it('should give 2 dice to the blocker when their strength is higher', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 6 }) }, null],
      [null, { player: new Player({ team: 'B', strength: 4 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 2,
      chooser: 'blocker',
      blockerStrength: 6,
      targetStrength: 4,
      blockerAssists: 0,
      targetAssists: 0,
      error: null,
    });
  });

  /**
   * Tests that the blocker gets 1 die when strengths are equal.
   */
  it('should give 1 die to the blocker when strengths are equal', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 5 }) }, null],
      [null, { player: new Player({ team: 'B', strength: 5 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 1,
      chooser: 'blocker',
      blockerStrength: 5,
      targetStrength: 5,
      blockerAssists: 0,
      targetAssists: 0,
      error: null,
    });
  });

  /**
   * Tests that the function returns an error if either the blocker or target position is empty.
   */
  it('should return an error for empty blocker or target positions', () => {
    const grid = [
      [null, null],
      [null, null]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      error: 'Missing blocker or target player on the grid',
    });
  });

  /**
   * Tests that the target gets 3 dice when their strength is more than double the blocker's.
   */
  it('should give 3 dice to the target when their strength is more than double the blocker', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 2 }) }, null],
      [null, { player: new Player({ team: 'B', strength: 5 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 3,
      chooser: 'target',
      blockerStrength: 2,
      targetStrength: 5,
      blockerAssists: 0,
      targetAssists: 0,
      error: null,
    });
  });

  /**
   * Tests that the function returns an error if the blocker and target are on the same team.
   */
  it('should return an error if blocker and target are on the same team', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 5 }) }, null],
      [null, { player: new Player({ team: 'A', strength: 5 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      error: 'Players are on the same team — blocking teammates is not allowed',
    });
  });

  /**
   * Tests that blocker assists are correctly calculated and added to their strength.
   */
  it('should correctly calculate and apply blocker assists', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 5 }) }, { player: new Player({ team: 'A', strength: 1 }) }],
      [null, { player: new Player({ team: 'B', strength: 5 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 2,
      chooser: 'blocker',
      blockerStrength: 6,
      targetStrength: 5,
      blockerAssists: 1,
      targetAssists: 0,
      error: null,
    });
  });

  /**
   * Tests that target assists are correctly calculated and added to their strength.
   */
  it('should correctly calculate and apply target assists', () => {
    const grid = [
      [{ player: new Player({ team: 'A', strength: 5 }) }, null],
      [null, { player: new Player({ team: 'B', strength: 5 }) }, { player: new Player({ team: 'B', strength: 1 }) }]
    ];
    const blockerPos = { row: 0, col: 0 };
    const targetPos = { row: 1, col: 1 };
    const result = calculateBlockOutcome(grid, blockerPos, targetPos);
    expect(result).toEqual({
      diceCount: 2,
      chooser: 'target',
      blockerStrength: 5,
      targetStrength: 6,
      blockerAssists: 0,
      targetAssists: 1,
      error: null,
    });
  });
});