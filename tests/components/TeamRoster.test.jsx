import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TeamRoster from '../../src/components/TeamRoster';
import { describe, it, expect } from 'vitest';

describe('TeamRoster Component', () => {
  it('test_render_team_colors', () => {
    render(<TeamRoster team="Red" actualTeamName="Imperial Guards" players={[]} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    // Kontrollera att headingen visas korrekt
    expect(screen.getByRole('heading', { name: /Red Team Roster/i })).toBeInTheDocument();
  });

  it('test_display_correct_player_count', () => {
    const players = [{ id: 1, name: 'Player 1', position: 'Forward', strength: 5, skills: [] }];
    render(<TeamRoster team="Blue" actualTeamName="Wood Elves" players={players} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    expect(screen.getByText(/1 players/i)).toBeInTheDocument();
  });

  it('test_select_unplaced_player', () => {
    const players = [{ id: 1, name: 'Player 1', position: 'Forward', strength: 5, skills: [] }];
    render(<TeamRoster team="Blue" actualTeamName="Wood Elves" players={players} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    const button = screen.getByRole('button', { name: /Select/i });
    expect(button).not.toBeDisabled();
  });

  it('test_handle_empty_player_list', () => {
    render(<TeamRoster team="Red" actualTeamName="Imperial Guards" players={[]} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    expect(screen.getByText(/No players in roster/i)).toBeInTheDocument();
  });

  it('test_format_display_player_skills', () => {
    const players = [{ id: 1, name: 'Player 1', position: 'Forward', strength: 5, skills: ['dribbling', 'shooting'] }];
    render(<TeamRoster team="Blue" actualTeamName="Wood Elves" players={players} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    expect(screen.getByText(/Skills: Dribbling, Shooting/i)).toBeInTheDocument();
  });

  it('test_handle_large_player_list', () => {
    const players = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Player ${i}`, position: 'Forward', strength: 5, skills: [] }));
    render(<TeamRoster team="Red" actualTeamName="Imperial Guards" players={players} onSelectPlayer={() => {}} placedPlayerIds={new Set()} />);
    expect(screen.getByText(/100 players/i)).toBeInTheDocument();
  });
});