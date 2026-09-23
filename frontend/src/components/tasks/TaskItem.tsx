import React from 'react';
import { CheckCircle2, Circle, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types/task';
import { Badge, Button } from '../ui';

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onSelectDetail: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onSelectDetail,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div
      className={`group p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 flex items-start sm:items-center justify-between gap-4 ${
        task.isCompleted
          ? 'border-[#EAE7DF] bg-[#FAF9F6]/60 opacity-75'
          : 'border-[#EAE7DF] hover:border-[#CDC7B8] shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Bouton de statut (terminé / en cours) */}
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className="mt-0.5 sm:mt-0 text-stone-400 hover:text-[#2D5A3C] transition shrink-0 cursor-pointer"
          aria-label={
            task.isCompleted
              ? 'Marquer comme non terminée'
              : 'Marquer comme terminée'
          }
        >
          {task.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#2D5A3C] fill-[#EAF3EB]" />
          ) : (
            <Circle className="w-5 h-5 text-stone-300 hover:text-[#2D5A3C]" />
          )}
        </button>

        {/* Contenu cliquable pour ouvrir la modale de détails */}
        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => onSelectDetail(task)}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-semibold truncate hover:text-[#2D5A3C] transition ${
                task.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
              }`}
            >
              {task.title}
            </h4>

            {/* Badge de statut réutilisable */}
            <Badge
              variant={task.isCompleted ? 'success' : 'warning'}
              size="sm"
            >
              {task.status || (task.isCompleted ? 'COMPLETED' : 'IN_PROGRESS')}
            </Badge>
          </div>

          {task.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelectDetail(task)}
          title="Voir les détails de la tâche"
          aria-label="Voir les détails"
        >
          <Eye className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          title="Modifier la tâche"
          aria-label="Modifier la tâche"
        >
          <Pencil className="w-4 h-4" />
        </Button>

        <Button
          variant="danger"
          size="icon"
          disabled={isDeleting}
          onClick={() => onDelete(task.id)}
          title="Supprimer la tâche"
          aria-label="Supprimer la tâche"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
