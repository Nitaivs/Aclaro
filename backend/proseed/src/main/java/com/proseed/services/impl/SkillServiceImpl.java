package com.proseed.services.impl;

import com.proseed.entities.Employee;
import com.proseed.entities.EmployeeSkill;
import com.proseed.services.SkillService;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;

import com.proseed.repos.EmployeeRepository;
import com.proseed.repos.EmployeeSkillRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class SkillServiceImpl implements SkillService {
    private final EmployeeSkillRepository repository;
    private final EmployeeRepository employeeRepository;

    public SkillServiceImpl(EmployeeSkillRepository repository, EmployeeRepository employeeRepository) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<EmployeeSkill> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<EmployeeSkill> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public EmployeeSkill create(EmployeeSkill skill) {
        return repository.save(skill);
    }

    @Override
    @Transactional
    public Optional<EmployeeSkill> update(Long id, EmployeeSkill skill) {
        return repository.findById(id).map(existing -> {
            existing.setName(skill.getName());
            return repository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        EmployeeSkill skill = repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Skill not found with id: " + id)
        );

        // Remove skill from associated employees
        Set<Employee> employees = skill.getEmployees();
        if (employees != null && !employees.isEmpty()) {
            for (Employee e : new HashSet<>(employees)) {
                e.getEmployeeSkills().remove(skill);
                employeeRepository.save(e);
            }
        }
        repository.delete(skill);
        return true;
    }
}
