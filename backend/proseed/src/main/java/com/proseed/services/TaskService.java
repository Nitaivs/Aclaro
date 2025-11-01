package com.proseed.services;

import com.proseed.entities.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> findAll();
    Optional<Task> findById(Long id);
    Task create(Long processId, Task task);
    Optional<Task> update(Long id, Task task);
    boolean delete(Long id);
}
