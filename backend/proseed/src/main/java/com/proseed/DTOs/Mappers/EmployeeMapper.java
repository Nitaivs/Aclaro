package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.entities.Employee;
import com.proseed.entities.EmployeeSkill;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeMapper {
    public static EmployeeDTO toEmployeeDTO(Employee employee) {
        return new EmployeeDTO(
            employee.getEmployeeId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getDepartment() != null ? employee.getDepartment().getId() : null,
            employee.getRole() != null ? employee.getRole().getRoleId() : null,
            employee.getEmployeeSkills() != null ?
                employee.getEmployeeSkills().stream()
                        .map(EmployeeSkill::getSkillId)
                        .collect(Collectors.toList())
                    : List.of()
        );
    }
}
