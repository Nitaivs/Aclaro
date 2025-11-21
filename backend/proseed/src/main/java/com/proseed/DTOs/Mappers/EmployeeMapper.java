package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.entities.Employee;
import java.util.stream.Collectors;

public class EmployeeMapper {
    public static EmployeeDTO toEmployeeDTO(Employee employee) {
        return new EmployeeDTO(
            employee.getEmployeeId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getDepartment() != null ? DepartmentMapper.toDepartmentDTO(employee.getDepartment()) : null,
            employee.getRole() != null ? RoleMapper.toRoleDTO(employee.getRole()) : null,
            employee.getEmployeeSkills() != null ?
                employee.getEmployeeSkills().stream()
                    .map(SkillMapper::toSkillDTO)
                    .collect(Collectors.toList())
                : null
        );
    }
}
