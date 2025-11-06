package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
