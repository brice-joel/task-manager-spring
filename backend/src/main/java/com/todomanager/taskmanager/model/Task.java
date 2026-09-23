package com.todomanager.taskmanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.todomanager.taskmanager.model.enums.TaskStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 255)
    private String title;
    @Column(nullable = false, length = 255)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 255)
    private TaskStatus status = TaskStatus.PENDING;
    @Column(nullable = false)
    private boolean completed;

    // 3. Le filet de sécurité JPA avant l'insertion en base
    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = TaskStatus.PENDING;
        }
    }

    public Task(String title, String description, TaskStatus status, boolean completed) {
        this.title = title;
        this.description = description;
        this.status = (status != null) ? status : TaskStatus.PENDING;
        this.completed = completed; 
    }

    public Task() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

}
