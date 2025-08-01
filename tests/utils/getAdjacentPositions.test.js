import { describe, it, expect } from 'vitest';
import { getAdjacentPositions } from '@/utils/getAdjacentPositions';

/**
 * @file Test suite for the getAdjacentPositions utility function.
 */
describe('getAdjacentPositions', () => {
  /**
   * Tests that the function returns all 8 adjacent positions for a point in the middle of the grid.
   */
  it('should return all 8 adjacent positions for a central point', () => {
    const position = { row: 5, col: 5 };
    const expected = [
      { row: 4, col: 4 }, { row: 4, col: 5 }, { row: 4, col: 6 },
      { row: 5, col: 4 }, /* center */ { row: 5, col: 6 },
      { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 6, col: 6 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });

  /**
   * Tests that the function correctly calculates adjacent positions for a point on an edge.
   */
  it('should correctly calculate adjacent positions for an edge point', () => {
    const position = { row: 0, col: 5 };
    const expected = [
      { row: -1, col: 4 }, { row: -1, col: 5 }, { row: -1, col: 6 },
      { row: 0, col: 4 }, /* center */ { row: 0, col: 6 },
      { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });

  /**
   * Tests that the function correctly calculates adjacent positions for a corner point.
   */
  it('should correctly calculate adjacent positions for a corner point', () => {
    const position = { row: 0, col: 0 };
    const expected = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, /* center */ { row: 0, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });

  /**
   * Tests that the function handles negative indices correctly.
   */
  it('should handle negative indices correctly', () => {
    const position = { row: -1, col: -1 };
    const expected = [
      { row: -2, col: -2 }, { row: -2, col: -1 }, { row: -2, col: 0 },
      { row: -1, col: -2 }, /* center */ { row: -1, col: 0 },
      { row: 0, col: -2 }, { row: 0, col: -1 }, { row: 0, col: 0 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });

  /**
   * Tests that the function handles non-integer (float) indices.
   */
  it('should handle non-integer indices', () => {
    const position = { row: 5.5, col: 5.5 };
    const expected = [
      { row: 4.5, col: 4.5 }, { row: 4.5, col: 5.5 }, { row: 4.5, col: 6.5 },
      { row: 5.5, col: 4.5 }, /* center */ { row: 5.5, col: 6.5 },
      { row: 6.5, col: 4.5 }, { row: 6.5, col: 5.5 }, { row: 6.5, col: 6.5 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });

  /**
   * Tests that the function handles large index values.
   */
  it('should handle large indices', () => {
    const position = { row: 1000000, col: 1000000 };
    const expected = [
      { row: 999999, col: 999999 }, { row: 999999, col: 1000000 }, { row: 999999, col: 1000001 },
      { row: 1000000, col: 999999 }, /* center */ { row: 1000000, col: 1000001 },
      { row: 1000001, col: 999999 }, { row: 1000001, col: 1000000 }, { row: 1000001, col: 1000001 }
    ];
    expect(getAdjacentPositions(position)).toEqual(expected);
  });
});