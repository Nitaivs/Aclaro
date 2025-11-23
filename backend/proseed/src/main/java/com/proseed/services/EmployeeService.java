package com.proseed.services;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.EmployeePatchDTO;
import com.proseed.entities.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    Optional<EmployeeDTO> findById(Long id);
    Employee create(Employee employee);
    Optional<Employee> update(Long id, Employee employee);
    /**
     * Partially update an employee with fields present in the DTO (e.g., firstName/lastName).
     */
    Optional<EmployeeDTO> updatePartial(Long id, EmployeePatchDTO patch);
    boolean delete(Long id);
    com.proseed.entities.Department addDepartmentToEmployee(Employee employee, Long departmentId);
    com.proseed.entities.Role addRoleToEmployee(Employee employee, Long roleId);
    void setSkillsToEmployee(Long employeeId, List<Long> skillIds);
}
