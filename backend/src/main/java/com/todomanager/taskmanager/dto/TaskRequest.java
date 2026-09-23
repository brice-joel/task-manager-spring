package com.todomanager.taskmanager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.todomanager.taskmanager.model.enums.TaskStatus;

public record TaskRequest(
        @NotBlank(message = "Le titre est requis")
        @Size(min = 3, max = 255, message = "Le titre doit comporter entre 3 et 255 caractères")
        String title,
        
        @NotBlank(message = "La description est requise")
        @Size(min = 3, max = 255, message = "La description doit comporter entre 3 et 255 caractères")
        String description,
        
        @NotNull(message = "Le statut est requis")
        TaskStatus status,
        
        @NotNull(message = "Le statut doit etre vrai ou fausse")
        Boolean isCompleted
        ) {

}
