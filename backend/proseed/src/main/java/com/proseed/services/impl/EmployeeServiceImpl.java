package com.proseed.services.impl;

import com.proseed.entities.Employee;
import com.proseed.repos.EmployeeRepository;
import com.proseed.services.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employee> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Employee> findById(Long id) {
        return repository.findById(id);
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
    public boolean delete(Long id) {
        return repository.findById(id).map(e -> { repository.delete(e); return true; }).orElse(false);
    }
}
