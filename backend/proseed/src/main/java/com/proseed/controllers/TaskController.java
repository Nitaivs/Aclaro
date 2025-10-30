package com.proseed.controllers;

import com.proseed.entities.Task;
import com.proseed.entities.ProcessEntity;
import com.proseed.repos.TaskRepository;
import com.proseed.repos.ProcessRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final ProcessRepository processRepository;

    public TaskController(TaskRepository taskRepository, ProcessRepository processRepository) {
        this.taskRepository = taskRepository;
        this.processRepository = processRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestParam Long processId) {
        com.proseed.entities.ProcessEntity process = processRepository.findById(processId).orElse(null);
        if (process == null) {
            throw new IllegalArgumentException("Process not found with id: " + processId);
        }
        task.setProcess(process);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id)
            .map(existing -> {
                existing.setTaskName(updatedTask.getTaskName());
                existing.setTaskDescription(updatedTask.getTaskDescription());
                existing.setCompleted(updatedTask.isCompleted());
                // Add other updatable fields as needed
                return taskRepository.save(existing);
            })
            .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}
