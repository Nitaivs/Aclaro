package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.TaskWithEmployeesDTO;
import com.proseed.entities.Task;
import java.util.List;
import java.util.stream.Collectors;

public class TaskMapper {
    public static TaskWithEmployeesDTO toTaskWithEmployeesDTO(Task task) {
        List<EmployeeDTO> employees = task.getEmployees() != null
            ? task.getEmployees().stream()
                .map(EmployeeMapper::toEmployeeDTO)
                .collect(Collectors.toList())
            : List.of();
        return new TaskWithEmployeesDTO(
            task.getTaskId(),
            employees
        );
    }
}
