package com.proseed.controllers;

import com.proseed.entities.Task;
import com.proseed.entities.Employee;
import com.proseed.services.TaskService;
import com.proseed.DTOs.TaskWithEmployeesDTO;
import com.proseed.DTOs.TaskDTO;
import com.proseed.DTOs.Mappers.TaskMapper;
import com.proseed.repos.EmployeeRepository;
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
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final EmployeeRepository employeeRepository;

    public TaskController(TaskService taskService, EmployeeRepository employeeRepository) {
        this.taskService = taskService;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        List<TaskDTO> dtos = tasks.stream().map(TaskMapper::toTaskDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
    return taskService.findById(id)
            .map(TaskMapper::toTaskDTO)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{id}/employees")
    public ResponseEntity<?> getTaskWithEmployees(@PathVariable Long id) {
        try {
            TaskWithEmployeesDTO dto = taskService.getTaskWithEmployees(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDto, @RequestParam Long processId) {
        try {
            Task task = TaskMapper.fromTaskDTO(taskDto);
            // map employee ids to entities recursively
            assignEmployeesRecursively(task, taskDto);
            Task saved = taskService.create(processId, task);
            return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toTaskDTO(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO updatedTaskDto) {
        Task updatedTask = TaskMapper.fromTaskDTO(updatedTaskDto);
        assignEmployeesRecursively(updatedTask, updatedTaskDto);
        return taskService.update(id, updatedTask)
            .map(TaskMapper::toTaskDTO)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return taskService.delete(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    private void assignEmployeesRecursively(Task task, TaskDTO dto) {
        if (dto.getEmployeeIds() != null && !dto.getEmployeeIds().isEmpty()) {
            List<Employee> employees = employeeRepository.findAllById(dto.getEmployeeIds());
            task.setEmployees(new java.util.HashSet<>(employees));
        }
        if (dto.getSubTasks() != null && task.getSubTasks() != null) {
            // match by order/position: map each dto subtask to corresponding Task entity in set
            // since Task.subTasks is a Set, we will rely on sizes and iterate in insertion order by converting to list
            List<Task> subEntities = task.getSubTasks().stream().toList();
            for (int i = 0; i < Math.min(subEntities.size(), dto.getSubTasks().size()); i++) {
                assignEmployeesRecursively(subEntities.get(i), dto.getSubTasks().get(i));
            }
        }
    }
}
