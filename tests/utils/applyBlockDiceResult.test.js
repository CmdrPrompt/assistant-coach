import { describe, it, expect } from 'vitest';
import { Player } from '@/models/Player';
import { applyBlockDiceResult } from '@/utils/applyBlockDiceResult';
import { BLOCK_DICE_RESULTS } from '@/constants/BlockDiceResults';

describe('applyBlockDiceResult', () => {
  const blocker = new Player({ id: 1, name: 'Blocker', team: 'A', strength: 3 });
  const target = new Player({ id: 3, name: 'Target', team: 'B', strength: 3 });
  const blockerWithBlock = new Player({ id: 5, name: 'BlockerWithBlock', team: 'A', strength: 3, skills: ['Block'] });
  const targetWithBlock = new Player({ id: 6, name: 'TargetWithBlock', team: 'B', strength: 3, skills: ['Block'] });
  const blockerWithTackle = new Player({ id: 2, name: 'Tackler', team: 'A', strength: 3, skills: ['Tackle'] });
  const targetWithDodge = new Player({ id: 4, name: 'Dodger', team: 'B', strength: 3, skills: ['Dodge'] });
  const blockerWithWrestle = new Player({ id: 7, name: 'Wrestler', team: 'A', strength: 3, skills: ['Wrestle'] });
  const targetWithWrestle = new Player({ id: 8, name: 'TargetWrestler', team: 'B', strength: 3, skills: ['Wrestle'] });
  const blockerWithBlockAndWrestle = new Player({ id: 9, name: 'BlockWrestler', team: 'A', strength: 3, skills: ['Block', 'Wrestle'] });

  it('should handle a simple Push result without modification', () => {
    const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.PUSH, blocker, target);
    expect(result).toEqual({
      finalOutcome: 'Push',
      description: 'The result is a Push.',
    });
  });

  it('should handle a simple Pow result without modification', () => {
    const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.POW, blocker, target);
    expect(result).toEqual({
      finalOutcome: 'Pow',
      description: 'The result is a Pow.',
    });
  });

  describe('when result is Defender Stumbles', () => {
    it('should result in Knocked Down if target has no Dodge', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.DEFENDER_STUMBLES, blocker, target);
      expect(result).toEqual({
        finalOutcome: 'Knocked Down',
        description: 'Target is Knocked Down.',
      });
    });

    it('should be converted to a Push if target has Dodge and blocker does not have Tackle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.DEFENDER_STUMBLES, blocker, targetWithDodge);
      expect(result).toEqual({
        finalOutcome: 'Push',
        description: 'Dodger uses Dodge to avoid falling. The result is a Push.',
      });
    });

    it('should result in Knocked Down if target has Dodge but blocker has Tackle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.DEFENDER_STUMBLES, blockerWithTackle, targetWithDodge);
      expect(result).toEqual({
        finalOutcome: 'Knocked Down',
        description: "Tackler's Tackle negates Dodger's Dodge. Target is Knocked Down.",
      });
    });
  });

  describe('when result is Both Down', () => {
    it('should result in Both Down if neither player has Block or Wrestle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blocker, target);
      expect(result).toEqual({
        finalOutcome: 'Both Down',
        description: 'Neither player has Block or Wrestle. Both players are Knocked Down.',
      });
    });

    it('should result in Target Down if only the blocker has Block', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blockerWithBlock, target);
      expect(result).toEqual({
        finalOutcome: 'Target Down',
        description: 'BlockerWithBlock uses Block. Target is Knocked Down.',
      });
    });

    it('should result in Attacker Down if only the target has Block', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blocker, targetWithBlock);
      expect(result).toEqual({
        finalOutcome: 'Attacker Down',
        description: 'TargetWithBlock uses Block. Blocker is Knocked Down.',
      });
    });

    it('should result in a Standoff if both players have Block', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blockerWithBlock, targetWithBlock);
      expect(result).toEqual({
        finalOutcome: 'Standoff',
        description: 'Both players use Block. No one is Knocked Down.',
      });
    });

    it('should result in Both Prone if only the blocker has Wrestle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blockerWithWrestle, target);
      expect(result).toEqual({
        finalOutcome: 'Both Prone',
        description: 'A player with Wrestle is involved. Both players are Placed Prone.',
      });
    });

    it('should result in Both Prone if only the target has Wrestle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blocker, targetWithWrestle);
      expect(result).toEqual({
        finalOutcome: 'Both Prone',
        description: 'A player with Wrestle is involved. Both players are Placed Prone.',
      });
    });

    it('should result in Both Prone if both players have Wrestle', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blockerWithWrestle, targetWithWrestle);
      expect(result).toEqual({
        finalOutcome: 'Both Prone',
        description: 'A player with Wrestle is involved. Both players are Placed Prone.',
      });
    });

    it('should result in Target Down if blocker has Block and Wrestle (Block takes precedence)', () => {
      const result = applyBlockDiceResult(BLOCK_DICE_RESULTS.BOTH_DOWN, blockerWithBlockAndWrestle, targetWithWrestle);
      expect(result).toEqual({
        finalOutcome: 'Target Down',
        description: 'BlockWrestler uses Block. TargetWrestler is Knocked Down.',
      });
    });
  });
});