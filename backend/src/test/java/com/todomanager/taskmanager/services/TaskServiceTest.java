package com.todomanager.taskmanager.services;

import com.todomanager.taskmanager.dto.TaskRequest;
import com.todomanager.taskmanager.dto.TaskResponse;
import com.todomanager.taskmanager.exception.ResourceNotFoundException;
import com.todomanager.taskmanager.model.Task;
import com.todomanager.taskmanager.model.enums.TaskStatus;
import com.todomanager.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    @DisplayName("createTask: doit sauvegarder et retourner la tâche créée")
    void shouldCreateTaskSuccessfully() {
        // GIVEN (Données d'entrée)
        TaskRequest request = new TaskRequest(
                "Apprendre les tests",
                "Comprendre JUnit et Mockito",
                TaskStatus.IN_PROGRESS,
                false
        );

        Task savedTask = new Task(request.title(), request.description(), request.status(), request.isCompleted());
        savedTask.setId(1L);

        // On simule le comportement du repository (mock)
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN (Action exécutée)
        TaskResponse response = taskService.createTask(request);

        // THEN (Vérifications)
        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Apprendre les tests", response.title());
        assertEquals(TaskStatus.IN_PROGRESS, response.status());
        assertFalse(response.isCompleted());

        // On s'assure que save() a été appelé exactement 1 fois
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("getTaskById: doit retourner la tâche quand l'ID existe")
    void shouldReturnTaskWhenIdExists() {
        // GIVEN
        Long taskId = 10L;
        Task existingTask = new Task("Tâche existante", "Description", TaskStatus.COMPLETED, true);
        existingTask.setId(taskId);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));

        // WHEN
        TaskResponse response = taskService.getTaskById(taskId);

        // THEN
        assertNotNull(response);
        assertEquals(taskId, response.id());
        assertEquals("Tâche existante", response.title());
        assertTrue(response.isCompleted());
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    @DisplayName("getTaskById: doit lancer ResourceNotFoundException quand l'ID n'existe pas")
    void shouldThrowExceptionWhenTaskNotFound() {
        // GIVEN
        Long unknownId = 999L;
        when(taskRepository.findById(unknownId)).thenReturn(Optional.empty());

        // WHEN & THEN (On vérifie que l'exception attendue est bien levée)
        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(unknownId));
        verify(taskRepository, times(1)).findById(unknownId);
    }

    @Test
    @DisplayName("getAllTasks: doit retourner la liste de toutes les tâches")
    void shouldReturnAllTasks() {
        // GIVEN
        Task task1 = new Task("Tâche 1", "Desc 1", TaskStatus.PENDING, false);
        task1.setId(1L);
        Task task2 = new Task("Tâche 2", "Desc 2", TaskStatus.COMPLETED, true);
        task2.setId(2L);

        when(taskRepository.findAll()).thenReturn(List.of(task1, task2));

        // WHEN
        List<TaskResponse> tasks = taskService.getAllTasks();

        // THEN
        assertEquals(2, tasks.size());
        assertEquals("Tâche 1", tasks.get(0).title());
        assertEquals("Tâche 2", tasks.get(1).title());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("deleteTask: doit lancer une exception si la tâche n'existe pas")
    void shouldThrowExceptionWhenDeletingNonExistentTask() {
        // GIVEN
        Long unknownId = 42L;
        when(taskRepository.existsById(unknownId)).thenReturn(false);

        // WHEN & THEN
        assertThrows(ResourceNotFoundException.class, () -> taskService.deleteTask(unknownId));
        verify(taskRepository, never()).deleteById(anyLong());
    }
}
