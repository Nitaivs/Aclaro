package com.proseed.services;

import com.proseed.DTOs.TaskWithEmployeesDTO;
import com.proseed.entities.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> findAll();
    Optional<Task> findById(Long id);
    Task create(Long processId, Task task, Long parentId);
    Optional<Task> update(Long id, Task task, Long parentId, Long processId);
    boolean delete(Long id);
    TaskWithEmployeesDTO getTaskWithEmployees(Long id);
    /**
     * Remove a single employee assignment from a task. Idempotent.
     * Should update the join table only; does not delete any Employee.
     */
    void removeEmployeeFromTask(Long taskId, Long employeeId);

    /**
     * Insert a new task between an existing parent and child task.
     * The new task becomes a child of the parent and the new parent of the child.
     * 
     * @param parentTaskId ID of the task that will become the parent of the new task
     * @param childTaskId ID of the task that will become the child of the new task
     * @param newTask The new task to insert between parent and child
     * @return The created task with updated relationships
     * @throws IllegalArgumentException if the child is not actually a child of the parent
     * @throws jakarta.persistence.EntityNotFoundException if parent or child task is not found
     */
    Task insertTaskBetween(Long parentTaskId, Long childTaskId, Task newTask);
}
