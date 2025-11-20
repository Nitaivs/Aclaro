package com.proseed.services;

import com.proseed.entities.Department;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    List<Department> findAll();
    Optional<Department> findById(Long id);
    Department create(Department department);
    Optional<Department> update(Long id, Department updated);
    void delete(Long id);
}