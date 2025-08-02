import { describe, it, expect } from 'vitest';
import { getDiceCountAndChooser } from '@/utils/getDiceCountAndChooser';

describe('getDiceCountAndChooser', () => {
  // Updated rules:
  // - If both players have the same strength, 1 die, stronger player chooses (but both are equal)
  // - If one player has higher strength, 2 dice, stronger player chooses
  // - If one player has more than double strength, 3 dice, stronger player chooses

  it('should return 1 die if strengths are equal', () => {
    expect(getDiceCountAndChooser(5, 5)).toEqual({ diceCount: 1, chooser: 'blocker' });
    expect(getDiceCountAndChooser(8, 8)).toEqual({ diceCount: 1, chooser: 'blocker' });
    expect(getDiceCountAndChooser(12, 12)).toEqual({ diceCount: 1, chooser: 'blocker' });
  });

  it('should return 2 dice for the stronger player if strength is higher but not more than double', () => {
    expect(getDiceCountAndChooser(6, 5)).toEqual({ diceCount: 2, chooser: 'blocker' });
    expect(getDiceCountAndChooser(7, 6)).toEqual({ diceCount: 2, chooser: 'blocker' });
    expect(getDiceCountAndChooser(11, 10)).toEqual({ diceCount: 2, chooser: 'blocker' });
    expect(getDiceCountAndChooser(5, 6)).toEqual({ diceCount: 2, chooser: 'target' });
    expect(getDiceCountAndChooser(4, 7)).toEqual({ diceCount: 2, chooser: 'target' });
    expect(getDiceCountAndChooser(7, 11)).toEqual({ diceCount: 2, chooser: 'target' });
  });

  it('should return 3 dice for the stronger player if strength is more than double', () => {
    expect(getDiceCountAndChooser(10, 4)).toEqual({ diceCount: 3, chooser: 'blocker' });
    expect(getDiceCountAndChooser(9, 4)).toEqual({ diceCount: 3, chooser: 'blocker' });
    expect(getDiceCountAndChooser(20, 9)).toEqual({ diceCount: 3, chooser: 'blocker' });
    expect(getDiceCountAndChooser(4, 10)).toEqual({ diceCount: 3, chooser: 'target' });
    expect(getDiceCountAndChooser(4, 9)).toEqual({ diceCount: 3, chooser: 'target' });
    expect(getDiceCountAndChooser(9, 20)).toEqual({ diceCount: 3, chooser: 'target' });
  });
});