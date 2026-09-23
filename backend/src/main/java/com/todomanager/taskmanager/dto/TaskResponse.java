package com.todomanager.taskmanager.dto;

import com.todomanager.taskmanager.model.enums.TaskStatus;

public record TaskResponse(
    Long id, 
    String title, 
    String description, 
    TaskStatus status, 
    boolean isCompleted
) {

}
