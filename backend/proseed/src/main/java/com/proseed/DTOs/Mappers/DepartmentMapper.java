package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.DepartmentDTO;
import com.proseed.entities.Department;

public class DepartmentMapper {
    public static DepartmentDTO toDepartmentDTO(Department department) {
        return new DepartmentDTO(
            department.getId(),
            department.getName()
        );
    }
}
