import React, { useState } from 'react';
import { CheckCircle2, Clock, Hourglass } from 'lucide-react';
import type { CreateTaskDTO, TaskStatus } from '../../../types/task';
import { Button, Input } from '../../ui';

export interface TaskFormProps {
  initialValues?: Partial<CreateTaskDTO>;
  onSubmit: (data: CreateTaskDTO) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const statusOptions: { value: TaskStatus; label: string; icon: typeof Clock }[] = [
  { value: 'IN_PROGRESS', label: 'En cours', icon: Clock },
  { value: 'PENDING', label: 'En attente', icon: Hourglass },
  { value: 'COMPLETED', label: 'Terminée', icon: CheckCircle2 },
];

/**
 * Formulaire réutilisable pour la création et l'édition d'une tâche.
 * Comprend le titre, la description, le statut et l'état isCompleted.
 */
export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Enregistrer',
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(
    initialValues?.status ?? 'IN_PROGRESS'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    initialValues?.isCompleted ?? false
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: status || 'IN_PROGRESS',
      isCompleted,
    });
  };

  const handleToggleCompleted = (checked: boolean) => {
    setIsCompleted(checked);
    // Si l'utilisateur coche terminée et que le statut est IN_PROGRESS, suggérer COMPLETED
    if (checked && status === 'IN_PROGRESS') {
      setStatus('COMPLETED');
    } else if (!checked && status === 'COMPLETED') {
      setStatus('IN_PROGRESS');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Titre de la tâche */}
      <Input
        label="Titre de la tâche *"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex: Rédiger le rapport d'avancement..."
        disabled={isLoading}
      />

      {/* 2. Description */}
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1.5">
          Description *
        </label>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes et contexte détaillés sur la tâche..."
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E2D8] text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#2D5A3C] transition shadow-2xs resize-none"
        />
      </div>

      {/* 3. Sélecteur de statut */}
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1.5">
          Statut de la tâche *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatus(opt.value);
                  if (opt.value === 'COMPLETED') {
                    setIsCompleted(true);
                  } else if (isCompleted) {
                    setIsCompleted(false);
                  }
                }}
                disabled={isLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#2D5A3C] text-white border-[#2D5A3C] shadow-xs'
                    : 'bg-white text-stone-700 border-[#E5E2D8] hover:bg-[#F5F3ED]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Champ booléen isCompleted (Case à cocher moderne) */}
      <div className="p-3 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs">
        <label className="flex items-center justify-between cursor-pointer gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-stone-800">
              Marquer comme terminée (isCompleted)
            </span>
            <p className="text-[11px] text-stone-400">
              Indique si la tâche est déjà achevée.
            </p>
          </div>

          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => handleToggleCompleted(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 rounded text-[#2D5A3C] focus:ring-[#2D5A3C]/30 accent-[#2D5A3C] cursor-pointer"
          />
        </label>
      </div>

      {/* Boutons d'action */}
      <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#EAE7DF]">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!title.trim() || !description.trim()}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
