package com.proseed.services.impl;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.Mappers.EmployeeMapper;
import com.proseed.entities.Employee;
import com.proseed.entities.EmployeeSkill;
import com.proseed.repos.DepartmentRepository;
import com.proseed.repos.EmployeeRepository;
import com.proseed.repos.EmployeeSkillRepository;
import com.proseed.repos.RoleRepository;
import com.proseed.services.EmployeeService;
import com.proseed.entities.Task;
import com.proseed.repos.TaskRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository repository;
    private final TaskRepository taskRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;

    public EmployeeServiceImpl(EmployeeRepository repository,
                                TaskRepository taskRepository,
                                EmployeeSkillRepository employeeSkillRepository,
                                DepartmentRepository departmentRepository,
                                RoleRepository roleRepository) {
        this.repository = repository;
        this.taskRepository = taskRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<EmployeeDTO> findAll() {
        return repository.findAll().stream()
            .map(EmployeeMapper::toEmployeeDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Optional<EmployeeDTO> findById(Long id) {
        return repository.findById(id)
            .map(EmployeeMapper::toEmployeeDTO);
    }

    @Override
    @Transactional
    public Employee create(Employee employee) {
        return repository.save(employee);
    }

    @Override
    @Transactional
    public Optional<Employee> update(Long id, Employee employee) {
        return repository.findById(id).map(existing -> {
            existing.setFirstName(employee.getFirstName());
            existing.setLastName(employee.getLastName());
            return repository.save(existing);
        });
    }

    /**
     * Partially updates an employee's details.
     * Only non-null fields in the provided EmployeeDTO will be updated.
     * @param id The ID of the employee to update.
     * @param patch An EmployeeDTO containing the fields to update.
     * @return An Optional containing the updated EmployeeDTO, or empty if not found.
     * @throws EntityNotFoundException if a field cannot be found in the database.
     */
    @Override
    @Transactional
    public Optional<EmployeeDTO> updatePartial(Long id, EmployeeDTO patch) {
        return repository.findById(id).map(existing -> {
            if (patch.getFirstName() != null) existing.setFirstName(patch.getFirstName());
            if (patch.getLastName() != null) existing.setLastName(patch.getLastName());
            if (patch.getDepartmentId() != null) {
                existing.setDepartment(
                departmentRepository.findById(patch.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with id " + patch.getDepartmentId()))
                );
            }
            if (patch.getRoleName() != null) {
                existing.getRole().setRoleName(patch.getRoleName());
                //TODO
            }
            if (patch.getSkills() != null) {

            }

            Employee saved = repository.save(existing);
            return EmployeeMapper.toEmployeeDTO(saved);
        });
    }

    /**
     * Deletes an employee and removes all associations to tasks and skills.
     * @param id The ID of the employee to delete.
     * @return true if deletion was successful.
     * @throws EntityNotFoundException if the employee does not exist.
     */
    @Override
    @Transactional
    public boolean delete(Long id) {
        Employee employee = repository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException(
                                    "Employee not found with id " + id));
        // Remove employee from tasks (Task is the owning side)
        if (employee.getTasks() != null) {
            for(Task t : new HashSet<>(employee.getTasks())) {
                t.getEmployees().remove(employee);
                taskRepository.save(t);
            }
        }
        // Remove skills from employee
        if (employee.getEmployeeSkills() != null) {
            for (EmployeeSkill skill : new HashSet<> (employee.getEmployeeSkills())) {
                skill.getEmployees().remove(employee);
                employeeSkillRepository.save(skill);
            }
            employee.getEmployeeSkills().clear();
            repository.save(employee); // Flush join table
        }
        repository.delete(employee);
        return true;
    }
}
