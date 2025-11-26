package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.repos.ProcessRepository;
import com.proseed.repos.TaskRepository;
import com.proseed.repos.EmployeeRepository;
import com.proseed.entities.Employee;
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
    public Task create(Long processId, Task task, Long parentId) {
        ProcessEntity process = processRepository.findById(processId)
            .orElseThrow(() -> new IllegalArgumentException("Process not found with id: " + processId));
        task.setProcess(process);
        // Validate there are no circular references within the provided subtree
        validateNoCycles(task);
        // prepare and link any provided subtasks (set parent and process)
        if (task.getSubTasks() != null) {
            task.getSubTasks().forEach(sub -> prepareSubTasks(task, sub, process));
        }

        // Set parent if provided
        setParentWithId(task, parentId);

        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Optional<Task> update(Long id, Task task, Long parentId, Long processId) {
        // Resolve and reparent subtasks safely to avoid orphanRemoval accidental deletes.
        return taskRepository.findById(id).map(existing -> {
            existing.setName(task.getName());
            existing.setDescription(task.getDescription());
            existing.setCompleted(task.isCompleted());

            if (task.getSubTasks() != null) {
                // Build a resolved set of subtasks: existing managed entities for ids, or new ones for creations
                java.util.Set<Task> resolved = new java.util.LinkedHashSet<>();
                for (Task incoming : task.getSubTasks()) {
                    if (incoming.getId() != null) {
                        Task managed = taskRepository.findById(incoming.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Subtask not found: " + incoming.getId()));
                        // Prevent circular relationships: you cannot make an ancestor a child of its descendant
                        if (isAncestorOf(managed, existing) || managed.getId().equals(existing.getId())) {
                            throw new IllegalArgumentException(
                                "Circular subtask relationship detected: task " + managed.getId() +
                                " cannot be a child of its descendant " + existing.getId());
                        }
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

            // Set or clear parent as needed
            setParentWithId(existing, parentId);

            //set or update process
            setProcessWithId(existing, processId);

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

    /**
     * Returns true if candidateAncestor is an ancestor (direct or indirect parent) of node.
     */
    private boolean isAncestorOf(Task candidateAncestor, Task node) {
        Task cursor = node.getParentTask();
        while (cursor != null) {
            if (cursor.getId() != null && candidateAncestor.getId() != null
                && cursor.getId().equals(candidateAncestor.getId())) {
                return true;
            }
            cursor = cursor.getParentTask();
        }
        return false;
    }

    /**
     * Validate that there are no cycles within the provided task tree (DTO->entity graph) before persisting.
     * Uses taskId when present; otherwise falls back to object identity to detect self-reference.
     */
    private void validateNoCycles(Task root) {
        java.util.Set<Long> idPath = new java.util.HashSet<>();
        java.util.Set<Task> objPath = new java.util.HashSet<>();
        validateNoCyclesDfs(root, idPath, objPath);
    }

    private void validateNoCyclesDfs(Task node, java.util.Set<Long> idPath, java.util.Set<Task> objPath) {
        Long id = node.getId();
        if (id != null) {
            if (!idPath.add(id)) {
                throw new IllegalArgumentException("Circular subtask relationship detected in creation payload involving task id: " + id);
            }
        } else {
            if (!objPath.add(node)) {
                throw new IllegalArgumentException("Circular subtask relationship detected in creation payload (self-reference)");
            }
        }

        if (node.getSubTasks() != null) {
            for (Task child : node.getSubTasks()) {
                validateNoCyclesDfs(child, idPath, objPath);
            }
        }

        if (id != null) idPath.remove(id); else objPath.remove(node);
    }

    private void setParentWithId(Task task, Long parentId) {
        if (parentId != null) {
            Task parent = taskRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent task not found with id: " + parentId));
            task.setParentTask(parent);
        }
    }

    private void setProcessWithId(Task task, Long processId) {
        // Only set/replace the process when a non-null processId is provided.
        // A null processId indicates "no change" rather than explicit clearing.
        if (processId != null) {
            ProcessEntity process = processRepository.findById(processId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Process not found with id: " + processId));
            task.setProcess(process);
        }
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        //checks if task exists and deletes it if it doesn't have subtasks
        return taskRepository.findById(id).map(t -> {
            if (t.getSubTasks() != null && !t.getSubTasks().isEmpty()) {
                throw new IllegalArgumentException("Cannot delete task with id " + id + " because it has subtasks.");
            }
            taskRepository.delete(t);
            return true;
        }).orElse(false);
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

    @Override
    @Transactional
    public Task insertTaskBetween(Long parentTaskId, Long childTaskId, Task newTask) {
        // Find parent and child tasks
        Task parentTask = taskRepository.findById(parentTaskId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Parent task not found with id: " + parentTaskId));
        Task childTask = taskRepository.findById(childTaskId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Child task not found with id: " + childTaskId));

        // Validate that the child is actually a direct child of the parent
        if (childTask.getParentTask() == null || !childTask.getParentTask().getId().equals(parentTaskId)) {
            throw new IllegalArgumentException("Task " + childTaskId + " is not a direct child of task " + parentTaskId);
        }

        // Set up the new task
        newTask.setProcess(parentTask.getProcess());
        newTask.setParentTask(parentTask);

        // Initialize subtasks set if null
        if (newTask.getSubTasks() == null) {
            newTask.setSubTasks(new java.util.LinkedHashSet<>());
        }

        // Save the new task first to get an ID
        Task savedNewTask = taskRepository.save(newTask);

        // Update child's parent to point to the new task
        childTask.setParentTask(savedNewTask);
        taskRepository.save(childTask);

        // Add the child to the new task's subtasks
        savedNewTask.getSubTasks().add(childTask);

        // Update parent's subtasks: remove old child, add new task
        if (parentTask.getSubTasks() != null) {
            parentTask.getSubTasks().remove(childTask);
            parentTask.getSubTasks().add(savedNewTask);
        }
        taskRepository.save(parentTask);

        return savedNewTask;
    }
}
