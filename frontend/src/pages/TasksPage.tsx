import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListFilter,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Check,
  X,
  Pencil,
} from "lucide-react";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import type { Task, TaskFilter, CreateTaskDTO } from "../types/task";
import { Button, Badge, Input, Card, Modal } from "../components/ui";
import { TaskItem, TaskDetailModal, TaskForm } from "../components/tasks";
import { notify } from "../lib/notify";

export const TasksPage: React.FC = () => {
  // TanStack Query hooks
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTasks();

  const tasks = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Local state for filtering & search
  const [activeTab, setActiveTab] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal create state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Modal edit state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Modal task details state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  // Calculations & Filtering
  const stats = useMemo(() => {
    const total = tasks.length;
    const isCompleted = tasks.filter((t) => t.isCompleted).length;
    const inProgress = total - isCompleted;
    return { total, inProgress, isCompleted };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "completed"
            ? task.isCompleted
            : !task.isCompleted;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  // Actions
  const handleToggleComplete = (task: Task) => {
    const nextCompleted = !task.isCompleted;
    const nextStatus = nextCompleted ? "COMPLETED" : "IN_PROGRESS";

    updateTaskMutation.mutate(
      {
        id: task.id,
        data: {
          title: task.title,
          description: task.description,
          status: nextStatus,
          isCompleted: nextCompleted,
        },
      },
      {
        onSuccess: () => {
          notify.success(
            nextCompleted ? "Tâche terminée !" : "Tâche remise en cours",
            `"${task.title}" a été mise à jour.`
          );
        },
        onError: (err) => {
          notify.error(err, "Impossible de mettre à jour la tâche");
        },
      }
    );
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      deleteTaskMutation.mutate(id, {
        onSuccess: () => {
          notify.success("Tâche supprimée", "La tâche a bien été retirée.");
        },
        onError: (err) => {
          notify.error(err, "Impossible de supprimer la tâche");
        },
      });
    }
  };

  const handleCreateTask = (data: CreateTaskDTO) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        notify.success(
          "Tâche créée avec succès !",
          "Votre nouvelle tâche a été enregistrée."
        );
      },
      onError: (err) => {
        notify.error(err, "Échec de création de la tâche");
      },
    });
  };

  const handleUpdateTask = (data: CreateTaskDTO) => {
    if (!editingTask) return;

    updateTaskMutation.mutate(
      {
        id: editingTask.id,
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          isCompleted: data.isCompleted,
        },
      },
      {
        onSuccess: () => {
          setEditingTask(null);
          notify.success(
            "Tâche mise à jour !",
            "Les modifications ont été enregistrées avec succès."
          );
        },
        onError: (err) => {
          notify.error(err, "Impossible de modifier la tâche");
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            Gestion des Tâches
            <Sparkles className="w-4 h-4 text-[#3B7A51]" />
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Visualisez et planifiez vos activités en toute sérénité.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Rafraîchir les tâches"
            aria-label="Rafraîchir les tâches"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-[#2D5A3C]" : ""}`}
            />
          </Button>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Nouvelle Tâche
          </Button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-stone-500">
              Toutes les tâches
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">
              {stats.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F4F2EC] text-stone-700 flex items-center justify-center border border-[#E6E2D7]">
            <ListFilter className="w-4 h-4" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-stone-500">En cours</p>
            <p className="text-2xl font-bold text-[#8C5E24] mt-0.5">
              {stats.inProgress}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#8C5E24] flex items-center justify-center border border-[#F2DEBF]">
            <Clock className="w-4 h-4" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-stone-500">Terminées</p>
            <p className="text-2xl font-bold text-[#2D5A3C] mt-0.5">
              {stats.isCompleted}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAF3EB] text-[#2D5A3C] flex items-center justify-center border border-[#D5E6D8]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-1.5 rounded-2xl bg-white border border-[#EAE7DF] shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F4F2EC] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-stone-900 font-semibold shadow-xs border border-[#DDD9CE]"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Toutes
            <Badge variant="neutral" size="sm">
              {stats.total}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("in_progress")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "in_progress"
                ? "bg-white text-[#8C5E24] font-semibold shadow-xs border border-[#F0DDBE]"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            En cours
            <Badge variant="warning" size="sm">
              {stats.inProgress}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "completed"
                ? "bg-white text-[#2D5A3C] font-semibold shadow-xs border border-[#D1E5D4]"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Terminées
            <Badge variant="success" size="sm">
              {stats.isCompleted}
            </Badge>
          </button>
        </div>

        {/* Live Search */}
        <div className="flex-1 max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une tâche..."
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>
      </div>

      {/* Message d'erreur serveur (ex: Spring Boot éteint) */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F7D2D4] flex items-start justify-between gap-3 text-[#8C282F]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#8C282F] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">
                Connexion avec Spring Boot indisponible
              </p>
              <p className="text-[11px] text-[#A6373F] mt-0.5">
                Vérifiez que votre backend Spring Boot est bien démarré sur le
                port 8080.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => refetch()}
            className="bg-[#8C282F] hover:bg-[#722026] text-white!"
          >
            Réessayer
          </Button>
        </div>
      )}

      {/* Task List / Loading / Empty States */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-white border border-[#EAE7DF] animate-pulse flex items-center justify-between shadow-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-[#F2EFE8] rounded-md w-1/3"></div>
                <div className="h-3 bg-[#F7F5EF] rounded-md w-2/3"></div>
              </div>
              <div className="w-7 h-7 bg-[#F2EFE8] rounded-full"></div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EAE7DF] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3EB] text-[#2D5A3C] flex items-center justify-center mx-auto mb-3 border border-[#D5E6D8]">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">
            Aucune tâche trouvée
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Aucune tâche ne correspond à vos termes de recherche."
              : activeTab === "completed"
                ? "Aucune tâche marquée comme terminée pour le moment."
                : "Votre liste est propre et dégagée. Créez une première tâche pour démarrer !"}
          </p>
          <Button
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsModalOpen(true)}
            className="mt-4"
          >
            Créer une tâche
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onSelectDetail={(t) => setSelectedTaskId(t.id)}
              onEdit={(t) => setEditingTask(t)}
              onDelete={handleDeleteTask}
              isDeleting={deleteTaskMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modal - Création d'une nouvelle tâche */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#2D5A3C]" />
            Nouvelle Tâche
          </span>
        }
        description="Remplissez les informations ci-dessous pour créer une tâche."
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createTaskMutation.isPending}
        />
      </Modal>

      {/* Modal - Modification d'une tâche existante */}
      <Modal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        maxWidth="lg"
        title={
          <span className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#2D5A3C]" />
            Modifier la Tâche
          </span>
        }
        description="Modifiez les informations de votre tâche ci-dessous."
      >
        {editingTask && (
          <TaskForm
            initialValues={{
              title: editingTask.title,
              description: editingTask.description,
              status: editingTask.status,
              isCompleted: editingTask.isCompleted,
            }}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            isLoading={updateTaskMutation.isPending}
            submitLabel="Mettre à jour"
          />
        )}
      </Modal>

      {/* Modal - Consultation des détails d'une tâche */}
      <TaskDetailModal
        isOpen={selectedTaskId !== null}
        taskId={selectedTaskId}
        fallbackTask={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onToggleComplete={handleToggleComplete}
        onEdit={(t) => setEditingTask(t)}
      />
    </div>
  );
};
