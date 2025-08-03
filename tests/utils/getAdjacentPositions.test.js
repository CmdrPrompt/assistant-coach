import { describe, it, expect } from 'vitest';
import { getAdjacentPositions } from '@/utils/getAdjacentPositions';

/**
 * @file Test suite for the getAdjacentPositions utility function.
 */
describe('getAdjacentPositions', () => {
  /**
   * Tests that the function returns all 8 adjacent positions for a point in the middle of the grid.
   */
  it('should return all 8 adjacent positions for a central point within bounds', () => {
    const position = { row: 5, col: 5 };
    const expected = [
      { row: 4, col: 4 }, { row: 4, col: 5 }, { row: 4, col: 6 },
      { row: 5, col: 4 }, { row: 5, col: 6 },
      { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 6, col: 6 }
    ];
    expect(getAdjacentPositions(position, 15, 26)).toEqual(expected);
  });

  /**
   * Tests that the function correctly calculates adjacent positions for a point on an edge.
   */
  it('should only return valid adjacent positions for an edge point', () => {
    const position = { row: 0, col: 5 };
    const expected = [
      { row: 0, col: 4 }, { row: 0, col: 6 },
      { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 }
    ];
    expect(getAdjacentPositions(position, 15, 26)).toEqual(expected);
  });

  /**
   * Tests that the function correctly calculates adjacent positions for a corner point.
   */
  it('should only return valid adjacent positions for a corner point', () => {
    const position = { row: 0, col: 0 };
    const expected = [
      { row: 0, col: 1 },
      { row: 1, col: 0 }, { row: 1, col: 1 }
    ];
    expect(getAdjacentPositions(position, 15, 26)).toEqual(expected);
  });

  /**
   * Tests that the function handles negative indices correctly.
   */
  it('should return empty array for negative indices (out of bounds)', () => {
    const position = { row: -1, col: -1 };
    expect(getAdjacentPositions(position, 15, 26)).toEqual([{ row: 0, col: 0 }]);
  });

  /**
   * Tests that the function handles non-integer (float) indices.
   */
  it('should handle non-integer indices within bounds', () => {
    const position = { row: 5.5, col: 5.5 };
    const expected = [
      { row: 4.5, col: 4.5 }, { row: 4.5, col: 5.5 }, { row: 4.5, col: 6.5 },
      { row: 5.5, col: 4.5 }, { row: 5.5, col: 6.5 },
      { row: 6.5, col: 4.5 }, { row: 6.5, col: 5.5 }, { row: 6.5, col: 6.5 }
    ];
    expect(getAdjacentPositions(position, 15, 26)).toEqual(expected);
  });

  /**
   * Tests that the function handles large index values.
   */
  it('should return empty array for large indices (out of bounds)', () => {
    const position = { row: 1000000, col: 1000000 };
    expect(getAdjacentPositions(position, 15, 26)).toEqual([]);
  });
});