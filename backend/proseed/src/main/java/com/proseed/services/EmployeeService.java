package com.proseed.services;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.entities.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    Optional<EmployeeDTO> findById(Long id);
    Employee create(Employee employee);
    Optional<Employee> update(Long id, Employee employee);
    boolean delete(Long id);
}
