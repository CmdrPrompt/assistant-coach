import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerCreator from '../../src/components/PlayerCreator';
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';

describe('PlayerCreator Component', () => {
  it('renders form fields and Add Player button', () => {
    render(<PlayerCreator team="Red" onAddPlayer={() => {}} nextId={1} autoFocusName={false} onClose={() => {}} />);
    expect(screen.getByText(/Add New Red Player/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter player name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Player/i })).toBeInTheDocument();
  });

  it('calls onAddPlayer when Add Player button is clicked', () => {
    const onAddPlayer = vi.fn();
    render(<PlayerCreator team="Red" onAddPlayer={onAddPlayer} nextId={1} autoFocusName={false} onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Player/i }));
    expect(onAddPlayer).toHaveBeenCalled();
  });

  it('calls onAddPlayer when Enter is pressed in name input', () => {
    const onAddPlayer = vi.fn();
    render(<PlayerCreator team="Red" onAddPlayer={onAddPlayer} nextId={1} autoFocusName={false} onClose={() => {}} />);
    const nameInput = screen.getByPlaceholderText(/Enter player name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' });
    expect(onAddPlayer).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<PlayerCreator team="Red" onAddPlayer={() => {}} nextId={1} autoFocusName={false} onClose={onClose} />);
    fireEvent.keyDown(screen.getByText(/Add New Red Player/i), { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('toggles skill checkbox with Space', () => {
    render(<PlayerCreator team="Red" onAddPlayer={() => {}} nextId={1} autoFocusName={false} onClose={() => {}} />);
    const skillCheckbox = screen.getByLabelText(/Block/i);
    expect(skillCheckbox.checked).toBe(false);
    skillCheckbox.focus();
    fireEvent.keyDown(skillCheckbox, { key: ' ', code: 'Space' });
    expect(skillCheckbox.checked).toBe(true);
    fireEvent.keyDown(skillCheckbox, { key: ' ', code: 'Space' });
    expect(skillCheckbox.checked).toBe(false);
  });
});
