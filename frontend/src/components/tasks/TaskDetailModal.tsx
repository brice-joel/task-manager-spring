import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Hash, 
  AlignLeft, 
  Calendar,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { Modal, Button, Badge } from '../ui';
import { useTask } from '../../hooks/useTasks';
import type { Task } from '../../types/task';

export interface TaskDetailModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
  fallbackTask?: Task | null;
  onToggleComplete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

/**
 * Modale de consultation des détails d'une tâche.
 * Utilise la modale générique et charge les détails à jour via useTask().
 */
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  isOpen,
  onClose,
  fallbackTask,
  onToggleComplete,
  onEdit,
}) => {
  // Récupère les données fraîches de la tâche via l'API Spring Boot
  const { data: fetchedTask, isLoading, error } = useTask(taskId ?? 0);

  // Utilise la tâche distante ou la version déjà en mémoire (fallback)
  const currentTask = fetchedTask || (fallbackTask?.id === taskId ? fallbackTask : null);

  const isCompleted = currentTask?.isCompleted ?? false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2 text-stone-900">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0EDE6] border border-[#DDD9CE] text-[11px] font-mono text-stone-600">
            <Hash className="w-3 h-3 text-stone-400" />
            <span>{taskId ?? '—'}</span>
          </div>
          <span className="text-base font-bold">Détails de la tâche</span>
        </div>
      }
      description="Consultez les informations détaillées de votre tâche."
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {currentTask && onToggleComplete ? (
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggleComplete(currentTask)}
              icon={
                isCompleted ? (
                  <Circle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )
              }
            >
              {isCompleted ? 'Marquer comme en cours' : 'Marquer comme terminée'}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentTask && onEdit && (
              <Button
                variant="outline"
                size="sm"
                icon={<Pencil className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(currentTask);
                }}
              >
                Modifier
              </Button>
            )}

            <Button variant="secondary" size="sm" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      }
    >
      {isLoading && !currentTask ? (
        <div className="py-8 space-y-4 animate-pulse">
          <div className="h-6 bg-[#F0EDE6] rounded-md w-3/4"></div>
          <div className="h-20 bg-[#F5F3ED] rounded-xl w-full"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-[#F0EDE6] rounded-xl"></div>
            <div className="h-12 bg-[#F0EDE6] rounded-xl"></div>
          </div>
        </div>
      ) : error && !currentTask ? (
        <div className="py-6 text-center text-[#8C282F] space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-[#8C282F]" />
          <p className="font-semibold text-xs">Impossible de charger cette tâche</p>
          <p className="text-[11px] text-[#A6373F]">
            {error.message || 'La tâche est introuvable ou le backend ne répond pas.'}
          </p>
        </div>
      ) : currentTask ? (
        <div className="space-y-5">
          {/* Titre & Statut */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h4
                className={`text-lg font-bold leading-snug break-words ${
                  isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                }`}
              >
                {currentTask.title}
              </h4>

              <Badge
                variant={isCompleted ? 'success' : 'warning'}
                size="md"
                icon={
                  isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )
                }
              >
                {currentTask.status || (isCompleted ? 'COMPLETED' : 'IN_PROGRESS')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </span>
            <div className="p-4 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs">
              {currentTask.description ? (
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {currentTask.description}
                </p>
              ) : (
                <p className="text-xs italic text-stone-400">
                  Aucune description fournie pour cette tâche.
                </p>
              )}
            </div>
          </div>

          {/* Métadonnées & Cartes d'information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs">
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                État d'avancement
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                {isCompleted ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2D5A3C]" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#8C5E24]" />
                )}
                {isCompleted ? 'Tâche accomplie' : 'Tâche en attente / en cours'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE7DF] shadow-2xs">
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                Référence système
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                ID #{currentTask.id}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
