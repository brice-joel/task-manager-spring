package com.todomanager.taskmanager.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.todomanager.taskmanager.dto.TaskResponse;
import com.todomanager.taskmanager.repository.TaskRepository;
import com.todomanager.taskmanager.exception.ResourceNotFoundException;
import com.todomanager.taskmanager.model.Task;
import com.todomanager.taskmanager.dto.TaskRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(task -> new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.isCompleted())
                )
                .toList();
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.isCompleted());
    }

    public TaskResponse createTask(TaskRequest request){
        // 1. on creer l'entité à partie du DTO
        Task newTask = new Task(request.title(), request.description(), request.status(), request.isCompleted());
        // 2. on sauvegarde en BD grace au repository
        Task savedTask = taskRepository.save(newTask);
        //on retourne de DTO de reponse
        return new TaskResponse(
            savedTask.getId(),
            savedTask.getTitle(),
            savedTask.getDescription(),
            savedTask.getStatus(),
            savedTask.isCompleted()
        );
    }

    public TaskResponse updateTask(Long id, TaskRequest request){
        Task task = taskRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Cette tache est innexistante"));

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setCompleted(request.isCompleted());

        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(
            updatedTask.getId(),
            updatedTask.getTitle(),
            updatedTask.getDescription(),
            updatedTask.getStatus(),
            updatedTask.isCompleted()
        );
    }

    public void deleteTask(Long id){
        if(!taskRepository.existsById(id)){
            throw new ResourceNotFoundException("CETTE tache est introuvable");
        }
        taskRepository.deleteById(id);
    }



}
