/**
 * Énumération des statuts autorisés pour une tâche (aligné avec TaskStatus côté Spring Boot)
 */
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  isCompleted: boolean;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
  isCompleted?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  isCompleted?: boolean;
}

export type TaskFilter = 'all' | 'in_progress' | 'completed';
