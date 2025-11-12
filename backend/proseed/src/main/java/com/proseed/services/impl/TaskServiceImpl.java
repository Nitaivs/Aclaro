package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
import com.proseed.repos.EmployeeRepository;
import com.proseed.entities.Employee;
import com.proseed.DTOs.TaskDTO;
import com.proseed.services.TaskService;
import com.proseed.DTOs.Mappers.TaskMapper;
import com.proseed.DTOs.TaskWithEmployeesDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ProcessRepository processRepository;
    private final EmployeeRepository employeeRepository;

    public TaskServiceImpl(TaskRepository taskRepository, ProcessRepository processRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.processRepository = processRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> findAll() { return taskRepository.findAll(); }

    @Override
    @Transactional(readOnly = true)
    public Optional<Task> findById(Long id) { return taskRepository.findById(id); }

    @Override
    @Transactional
    public Task create(Long processId, Task task) {
        ProcessEntity process = processRepository.findById(processId)
            .orElseThrow(() -> new IllegalArgumentException("Process not found with id: " + processId));
        task.setProcess(process);
        // prepare and link any provided subtasks (set parent and process)
        if (task.getSubTasks() != null) {
            task.getSubTasks().forEach(sub -> prepareSubTasks(task, sub, process));
        }
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Optional<Task> update(Long id, Task task) {
        // Resolve and reparent subtasks safely to avoid orphanRemoval accidental deletes.
        return taskRepository.findById(id).map(existing -> {
            existing.setTaskName(task.getTaskName());
            existing.setTaskDescription(task.getTaskDescription());
            existing.setCompleted(task.isCompleted());

            if (task.getSubTasks() != null) {
                // Build a resolved set of subtasks: existing managed entities for ids, or new ones for creations
                java.util.Set<Task> resolved = new java.util.LinkedHashSet<>();
                for (Task incoming : task.getSubTasks()) {
                    if (incoming.getTaskId() != null) {
                        Task managed = taskRepository.findById(incoming.getTaskId())
                            .orElseThrow(() -> new IllegalArgumentException("Subtask not found: " + incoming.getTaskId()));
                        // reparent the managed entity
                        managed.setParentTask(existing);
                        managed.setProcess(existing.getProcess());
                        // recursively ensure children of managed (if dto provided) are prepared - leave as is if not provided
                        if (incoming.getSubTasks() != null) {
                            // map any provided nested DTOs onto managed's children recursively by calling prepareSubTasks
                            incoming.getSubTasks().forEach(child -> prepareSubTasks(managed, child, existing.getProcess()));
                        }
                        resolved.add(managed);
                    } else {
                        // new subtask: set parent/process recursively
                        prepareSubTasks(existing, incoming, existing.getProcess());
                        resolved.add(incoming);
                    }
                }

                // Ensure existing subtasks collection is initialized before replacing
                if (existing.getSubTasks() == null) {
                    existing.setSubTasks(new java.util.LinkedHashSet<>());
                }
                // Replace existing's subtasks with resolved set
                existing.getSubTasks().clear();
                existing.getSubTasks().addAll(resolved);
            }

            return taskRepository.save(existing);
        });
    }

    /**
     * Recursively set parent and process for subtasks and their children.
     */
    private void prepareSubTasks(Task parent, Task current, ProcessEntity process) {
        current.setParentTask(parent);
        current.setProcess(process);
        if (current.getSubTasks() != null) {
            current.getSubTasks().forEach(child -> prepareSubTasks(current, child, process));
        }
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return taskRepository.findById(id).map(t -> { taskRepository.delete(t); return true; }).orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskWithEmployeesDTO getTaskWithEmployees(Long id) {
        return taskRepository.findById(id)
            .map(TaskMapper::toTaskWithEmployeesDTO)
            .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }

    @Override
    @Transactional
    public void removeEmployeeFromTask(Long taskId, Long employeeId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));
        if (task.getEmployees() != null && task.getEmployees().remove(employee)) {
            taskRepository.save(task);
        }
    }
}
