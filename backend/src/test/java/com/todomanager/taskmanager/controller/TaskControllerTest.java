package com.todomanager.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todomanager.taskmanager.dto.TaskRequest;
import com.todomanager.taskmanager.dto.TaskResponse;
import com.todomanager.taskmanager.exception.ResourceNotFoundException;
import com.todomanager.taskmanager.model.enums.TaskStatus;
import com.todomanager.taskmanager.services.TaskService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @Test
    @DisplayName("GET /api/tasks: doit retourner la liste des tâches avec le statut 200 OK")
    void shouldReturnAllTasks() throws Exception {
        // GIVEN
        List<TaskResponse> tasks = List.of(
                new TaskResponse(1L, "Tâche 1", "Description 1", TaskStatus.PENDING, false),
                new TaskResponse(2L, "Tâche 2", "Description 2", TaskStatus.COMPLETED, true)
        );
        when(taskService.getAllTasks()).thenReturn(tasks);

        // WHEN & THEN
        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Tâche 1"))
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Tâche 2"));

        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    @DisplayName("GET /api/tasks/{id}: doit retourner une tâche existante avec 200 OK")
    void shouldReturnTaskById() throws Exception {
        // GIVEN
        Long taskId = 1L;
        TaskResponse response = new TaskResponse(taskId, "Tâche trouvée", "Description", TaskStatus.IN_PROGRESS, false);
        when(taskService.getTaskById(taskId)).thenReturn(response);

        // WHEN & THEN
        mockMvc.perform(get("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.title").value("Tâche trouvée"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.isCompleted").value(false));

        verify(taskService, times(1)).getTaskById(taskId);
    }

    @Test
    @DisplayName("GET /api/tasks/{id}: doit retourner 404 NOT FOUND quand la tâche n'existe pas")
    void shouldReturn404WhenTaskNotFound() throws Exception {
        // GIVEN
        Long unknownId = 99L;
        when(taskService.getTaskById(unknownId)).thenThrow(new ResourceNotFoundException("Task not found"));

        // WHEN & THEN
        mockMvc.perform(get("/api/tasks/{id}", unknownId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(taskService, times(1)).getTaskById(unknownId);
    }

    @Test
    @DisplayName("POST /api/tasks: doit créer une tâche avec succès et renvoyer 201 CREATED")
    void shouldCreateTaskSuccessfully() throws Exception {
        // GIVEN
        TaskRequest request = new TaskRequest("Nouvelle tâche", "Description valide", TaskStatus.PENDING, false);
        TaskResponse response = new TaskResponse(1L, "Nouvelle tâche", "Description valide", TaskStatus.PENDING, false);

        when(taskService.createTask(any(TaskRequest.class))).thenReturn(response);

        // WHEN & THEN
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Nouvelle tâche"))
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(taskService, times(1)).createTask(any(TaskRequest.class));
    }

    @Test
    @DisplayName("POST /api/tasks: doit échouer avec 400 BAD REQUEST si le titre est vide (Validation @Valid)")
    void shouldReturn400WhenTitleIsBlank() throws Exception {
        // GIVEN: Titre vide, ce qui viole @NotBlank dans TaskRequest
        TaskRequest invalidRequest = new TaskRequest("", "Description", TaskStatus.PENDING, false);

        // WHEN & THEN
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        // Le service ne doit jamais être appelé si la validation Bean Validation a échoué
        verify(taskService, never()).createTask(any(TaskRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id}: doit retourner 204 NO CONTENT lors de la suppression")
    void shouldDeleteTaskSuccessfully() throws Exception {
        // GIVEN
        Long taskId = 1L;
        doNothing().when(taskService).deleteTask(taskId);

        // WHEN & THEN
        mockMvc.perform(delete("/api/tasks/{id}", taskId))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTask(taskId);
    }
}
