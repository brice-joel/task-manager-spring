import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import type { CreateTaskDTO, Task, UpdateTaskDTO } from '../types/task';
import type { ApiError } from '../types/apiError';

/**
 * Clés de requêtes TanStack Query pour la gestion du cache des tâches
 */
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  detail: (id: number) => ['tasks', id] as const,
};

/**
 * Hook pour récupérer la liste de toutes les tâches
 */
export const useTasks = () => {
  console.log("loading tasks");
  
  const { data, isLoading, error, refetch, isFetching } = useQuery<Task[], ApiError>({
    queryKey: TASK_QUERY_KEYS.all,
    queryFn: () => taskService.getAllTasks(),
  });

  return { data, isLoading, error, refetch, isFetching };
};

/**
 * Hook pour récupérer une tâche précise par ID
 */
export const useTask = (id: number) => {
  return useQuery<Task, ApiError>({
    queryKey: TASK_QUERY_KEYS.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook de mutation pour créer une nouvelle tâche avec invalidation automatique du cache
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, CreateTaskDTO>({
    mutationFn: (newTask: CreateTaskDTO) => taskService.createTask(newTask),
    onSuccess: () => {
      // Invalide et rafraîchit immédiatement la liste des tâches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour une tâche existante
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, { id: number; data: UpdateTaskDTO }>({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDTO }) =>
      taskService.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) });
    },
  });
};

/**
 * Hook de mutation pour supprimer une tâche
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};
