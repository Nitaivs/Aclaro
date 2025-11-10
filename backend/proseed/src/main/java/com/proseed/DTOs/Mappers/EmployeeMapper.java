package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.entities.Employee;

public class EmployeeMapper {
    public static EmployeeDTO toEmployeeDTO(Employee employee) {
        return new EmployeeDTO(
            employee.getEmployeeId(),
            employee.getFirstName(),
            employee.getLastName()
        );
    }
}
