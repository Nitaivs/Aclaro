package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
import com.proseed.services.TaskService;
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
    public List<Task> findAll() { return taskRepository.findAll(); }

    @Override
    public Optional<Task> findById(Long id) { return taskRepository.findById(id); }

    @Override
    @Transactional
    public Task create(Long processId, Task task) {
        ProcessEntity process = processRepository.findById(processId)
            .orElseThrow(() -> new IllegalArgumentException("Process not found with id: " + processId));
        task.setProcess(process);
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Optional<Task> update(Long id, Task task) {
        return taskRepository.findById(id).map(existing -> {
            existing.setTaskName(task.getTaskName());
            existing.setTaskDescription(task.getTaskDescription());
            existing.setCompleted(task.isCompleted());
            return taskRepository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return taskRepository.findById(id).map(t -> { taskRepository.delete(t); return true; }).orElse(false);
    }
}
