package com.proseed.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskWithEmployeesDTO {
    private Long taskId;
    private List<EmployeeDTO> assignedEmployees;
    private List<TaskWithEmployeesDTO> subTasks;
}
