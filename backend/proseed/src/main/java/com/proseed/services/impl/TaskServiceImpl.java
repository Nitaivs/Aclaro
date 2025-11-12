package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
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

    public TaskServiceImpl(TaskRepository taskRepository, ProcessRepository processRepository) {
        this.taskRepository = taskRepository;
        this.processRepository = processRepository;
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
        return taskRepository.findById(id).map(existing -> {
            existing.setTaskName(task.getTaskName());
            existing.setTaskDescription(task.getTaskDescription());
            existing.setCompleted(task.isCompleted());
            // if client provided subtasks, replace/manage them
            if (task.getSubTasks() != null) {
                // prepare each incoming subtask
                task.getSubTasks().forEach(sub -> prepareSubTasks(existing, sub, existing.getProcess()));
                existing.setSubTasks(task.getSubTasks());
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
}
