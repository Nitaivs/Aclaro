package com.proseed.controllers;

import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam Long processId) {
        return processRepository.findById(processId)
            .map(process -> {
                task.setProcess(process);
                Task saved = taskRepository.save(task);
                return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id)
            .map(existing -> {
                existing.setTaskName(updatedTask.getTaskName());
                existing.setTaskDescription(updatedTask.getTaskDescription());
                existing.setCompleted(updatedTask.isCompleted());
                // Add other updatable fields as needed
                Task saved = taskRepository.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
