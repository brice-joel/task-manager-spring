import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types/task';

describe('TaskItem Component (Test d\'Intégration Composant & Actions)', () => {
  const mockTask: Task = {
    id: 42,
    title: 'Acheter du pain',
    description: 'Baguette tradition au levain',
    status: 'IN_PROGRESS',
    isCompleted: false,
  };

  const defaultProps = {
    task: mockTask,
    onToggleComplete: vi.fn(),
    onSelectDetail: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isDeleting: false,
  };

  it('doit afficher les informations de la tâche (titre, description, statut)', () => {
    render(<TaskItem {...defaultProps} />);

    expect(screen.getByText('Acheter du pain')).toBeInTheDocument();
    expect(screen.getByText('Baguette tradition au levain')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
  });

  it('doit déclencher onToggleComplete quand on clique sur le bouton de statut', async () => {
    const user = userEvent.setup();
    const onToggleComplete = vi.fn();

    render(<TaskItem {...defaultProps} onToggleComplete={onToggleComplete} />);

    const toggleButton = screen.getByRole('button', { name: /Marquer comme terminée/i });
    await user.click(toggleButton);

    expect(onToggleComplete).toHaveBeenCalledTimes(1);
    expect(onToggleComplete).toHaveBeenCalledWith(mockTask);
  });

  it('doit déclencher onDelete avec l\'identifiant de la tâche quand on clique sur Supprimer', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<TaskItem {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /Supprimer la tâche/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it('doit déclencher onEdit quand on clique sur le bouton Modifier', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<TaskItem {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /Modifier la tâche/i });
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('doit désactiver le bouton de suppression si isDeleting est vrai', () => {
    render(<TaskItem {...defaultProps} isDeleting={true} />);

    const deleteButton = screen.getByRole('button', { name: /Supprimer la tâche/i });
    expect(deleteButton).toBeDisabled();
  });
});
