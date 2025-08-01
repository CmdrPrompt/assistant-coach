import { describe, it, expect } from 'vitest';
import { getDiceCountAndChooser } from '@/utils/getDiceCountAndChooser';

describe('getDiceCountAndChooser', () => {
  // Blocker gets dice
  it('should return 3 dice for the blocker if their strength is at least double the target', () => {
    expect(getDiceCountAndChooser(10, 5)).toEqual({ diceCount: 3, chooser: 'blocker' });
    expect(getDiceCountAndChooser(11, 5)).toEqual({ diceCount: 3, chooser: 'blocker' });
  });

  it('should return 2 dice for the blocker if their strength is greater than the target', () => {
    expect(getDiceCountAndChooser(6, 5)).toEqual({ diceCount: 2, chooser: 'blocker' });
  });

  it('should return 1 die for the blocker if strengths are equal', () => {
    expect(getDiceCountAndChooser(5, 5)).toEqual({ diceCount: 1, chooser: 'blocker' });
  });

  // Target gets dice
  it('should return 3 dice for the target if their strength is at least double the blocker', () => {
    expect(getDiceCountAndChooser(5, 10)).toEqual({ diceCount: 3, chooser: 'target' });
    expect(getDiceCountAndChooser(5, 11)).toEqual({ diceCount: 3, chooser: 'target' });
  });

  it('should return 2 dice for the target if their strength is greater than the blocker', () => {
    expect(getDiceCountAndChooser(5, 6)).toEqual({ diceCount: 2, chooser: 'target' });
  });
});