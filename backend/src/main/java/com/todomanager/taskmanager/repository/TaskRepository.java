package com.todomanager.taskmanager.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.todomanager.taskmanager.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

}
