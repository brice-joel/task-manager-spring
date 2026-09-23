import { apiClient } from '../api/api';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

/**
 * Couche Service Métier - Gestion des Tâches
 * Fait l'interface entre l'API HTTP et les composants/hooks de l'application.
 */
export const taskService = {
  /**
   * Récupère la liste de toutes les tâches
   * GET /api/tasks
   */
  async getAllTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks');
  
    return response.data;
  },

  /**
   * Récupère une tâche par son identifiant unique
   * GET /api/tasks/{id}
   */
  async getTaskById(id: number): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle tâche
   * POST /api/tasks
   */
  async createTask(data: CreateTaskDTO): Promise<any> {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  /**
   * Met à jour une tâche existante
   * PUT /api/tasks/{id}
   */
  async updateTask(id: number, data: UpdateTaskDTO): Promise<any> {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Supprime une tâche
   * DELETE /api/tasks/{id}
   */
  async deleteTask(id: number): Promise<any> {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};
