package com.proseed.services;

import com.proseed.DTOs.TaskWithEmployeesDTO;
import com.proseed.entities.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> findAll();
    Optional<Task> findById(Long id);
    Task create(Long processId, Task task, Long parentId);
    Optional<Task> update(Long id, Task task, Long parentId);
    boolean delete(Long id);
    TaskWithEmployeesDTO getTaskWithEmployees(Long id);
    /**
     * Remove a single employee assignment from a task. Idempotent.
     * Should update the join table only; does not delete any Employee.
     */
    void removeEmployeeFromTask(Long taskId, Long employeeId);
}
