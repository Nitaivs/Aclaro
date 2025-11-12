package com.proseed.services.impl;

import com.proseed.DTOs.EmployeeDTO;
import com.proseed.DTOs.Mappers.EmployeeMapper;
import com.proseed.entities.Employee;
import com.proseed.repos.EmployeeRepository;
import com.proseed.services.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import static java.util.stream.Collectors.toList;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<EmployeeDTO> findAll() {
        return repository.findAll().stream()
            .map(EmployeeMapper::toEmployeeDTO)
            .collect(toList());
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
        return repository.findById(id).map(e -> { repository.delete(e); return true; }).orElse(false);
    }
}
