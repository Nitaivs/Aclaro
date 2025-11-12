package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.TaskWithEmployeesDTO;
import com.proseed.entities.Task;
import com.proseed.DTOs.TaskDTO;
import com.proseed.entities.Employee;
import java.util.Set;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

public class TaskMapper {
    public static TaskWithEmployeesDTO toTaskWithEmployeesDTO(Task task) {
        List<EmployeeDTO> employees = task.getEmployees() != null
            ? task.getEmployees().stream()
                .map(EmployeeMapper::toEmployeeDTO)
                .collect(Collectors.toList())
            : List.of();
        List<TaskWithEmployeesDTO> subTasks = task.getSubTasks() != null
            ? task.getSubTasks().stream()
                .map(TaskMapper::toTaskWithEmployeesDTO)
                .collect(Collectors.toList())
            : List.of();

        return new TaskWithEmployeesDTO(
            task.getTaskId(),
            employees,
            subTasks
        );
    }

    public static TaskDTO toTaskDTO(Task task) {
        List<Long> employeeIds = task.getEmployees() != null
            ? task.getEmployees().stream().map(Employee::getEmployeeId).collect(Collectors.toList())
            : List.of();

        List<TaskDTO> subTasks = task.getSubTasks() != null
            ? task.getSubTasks().stream().map(TaskMapper::toTaskDTO).collect(Collectors.toList())
            : List.of();

        TaskDTO dto = new TaskDTO(
            task.getTaskId(),
            task.getTaskName(),
            task.getTaskDescription(),
            task.isCompleted(),
            employeeIds,
            subTasks
        );

        return dto;
    }

    public static Task fromTaskDTO(TaskDTO dto) {
        Task t = new Task();
        t.setTaskName(dto.getTaskName());
        t.setTaskDescription(dto.getTaskDescription());
        t.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : false);

        // map subtasks recursively
        if (dto.getSubTasks() != null) {
            Set<Task> subs = dto.getSubTasks().stream()
                .map(TaskMapper::fromTaskDTO)
                .collect(Collectors.toCollection(LinkedHashSet::new));
            t.setSubTasks(subs);
            // parent links will be set in service.prepareSubTasks before save
        }

        return t;
    }
}
