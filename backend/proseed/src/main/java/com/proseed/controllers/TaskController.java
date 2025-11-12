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

/**
 * REST controller for managing Task entities and their relationships.
 * Provides endpoints for CRUD operations, employee assignment, and subtask management.
 *
 * Endpoints:
 *   GET    /api/tasks                - List all tasks
 *   GET    /api/tasks/{id}           - Get task by ID
 *   GET    /api/tasks/{id}/employees - Get task with assigned employees
 *   POST   /api/tasks?processId=...  - Create a new task under a process
 *   PUT    /api/tasks/{id}           - Update a task (including subtasks and employees)
 *   DELETE /api/tasks/{id}           - Delete a task
 *
 * Subtask and employee assignment is handled recursively for nested tasks.
 */
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
    /**
     * Get all tasks in the system.
     * @return List of TaskDTOs (may be nested if subtasks exist)
     */
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        List<TaskDTO> dtos = tasks.stream().map(TaskMapper::toTaskDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    /**
     * Get a single task by its ID.
     * @param id Task ID
     * @return TaskDTO if found, 404 otherwise
     */
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskService.findById(id)
            .map(TaskMapper::toTaskDTO)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/{id}/employees")
    /**
     * Get a task and its assigned employees by ID.
     * @param id Task ID
     * @return TaskWithEmployeesDTO if found, 404 otherwise
     */
    public ResponseEntity<?> getTaskWithEmployees(@PathVariable Long id) {
        try {
            TaskWithEmployeesDTO dto = taskService.getTaskWithEmployees(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    /**
     * Create a new task under a given process.
     * Accepts a TaskDTO with optional subtasks and employee IDs.
     * @param taskDto Task data (may include subtasks and employeeIds)
     * @param processId ID of the process to attach the task to
     * @return Created TaskDTO, or 400 if invalid
     */
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDto, @RequestParam Long processId) {
        try {
            Task task = TaskMapper.fromTaskDTO(taskDto);
            // Recursively assign employees to this task and all subtasks
            assignEmployeesRecursively(task, taskDto);
            Task saved = taskService.create(processId, task);
            return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toTaskDTO(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    /**
     * Update an existing task, including its subtasks and assigned employees.
     * Accepts a TaskDTO with updated fields and relationships.
     * @param id Task ID to update
     * @param updatedTaskDto Updated task data
     * @return Updated TaskDTO if found, 404 otherwise
     */
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO updatedTaskDto) {
        Task updatedTask = TaskMapper.fromTaskDTO(updatedTaskDto);
        // Recursively assign employees to this task and all subtasks
        assignEmployeesRecursively(updatedTask, updatedTaskDto);
        return taskService.update(id, updatedTask)
            .map(TaskMapper::toTaskDTO)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    /**
     * Delete a task by its ID.
     * @param id Task ID
     * @return 204 No Content if deleted, 404 if not found
     */
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return taskService.delete(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Recursively assigns employees to a Task and its subtasks based on the DTO's employeeIds.
     * This ensures that nested subtasks receive their correct employee assignments.
     *
     * @param task The Task entity to assign employees to
     * @param dto  The corresponding TaskDTO containing employeeIds and subTasks
     */
    private void assignEmployeesRecursively(Task task, TaskDTO dto) {
        // Assign employees to this task if employeeIds are provided
        if (dto.getEmployeeIds() != null && !dto.getEmployeeIds().isEmpty()) {
            List<Employee> employees = employeeRepository.findAllById(dto.getEmployeeIds());
            task.setEmployees(new java.util.HashSet<>(employees));
        }
        // Recursively assign employees to subtasks
        if (dto.getSubTasks() != null && task.getSubTasks() != null) {
            // Match by order/position: map each DTO subtask to corresponding Task entity in set
            // Since Task.subTasks is a Set, rely on sizes and iterate in insertion order by converting to list
            List<Task> subEntities = task.getSubTasks().stream().toList();
            for (int i = 0; i < Math.min(subEntities.size(), dto.getSubTasks().size()); i++) {
                assignEmployeesRecursively(subEntities.get(i), dto.getSubTasks().get(i));
            }
        }
    }
}
