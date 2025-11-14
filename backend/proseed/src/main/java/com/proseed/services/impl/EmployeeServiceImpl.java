package com.proseed.services.impl;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.Mappers.EmployeeMapper;
import com.proseed.entities.Employee;
import com.proseed.entities.EmployeeSkill;
import com.proseed.repos.EmployeeRepository;
import com.proseed.repos.EmployeeSkillRepository;
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

    public EmployeeServiceImpl(EmployeeRepository repository,
                                TaskRepository taskRepository,
                                EmployeeSkillRepository employeeSkillRepository) {
        this.repository = repository;
        this.taskRepository = taskRepository;
        this.employeeSkillRepository = employeeSkillRepository;
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

    @Override
    @Transactional
    public Optional<EmployeeDTO> updatePartial(Long id, EmployeeDTO patch) {
        return repository.findById(id).map(existing -> {
            if (patch.getFirstName() != null) existing.setFirstName(patch.getFirstName());
            if (patch.getLastName() != null) existing.setLastName(patch.getLastName());
            Employee saved = repository.save(existing);
            return EmployeeMapper.toEmployeeDTO(saved);
        });
    }

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
