package com.proseed.services.impl;

import com.proseed.entities.Department;
import com.proseed.repos.DepartmentRepository;
import com.proseed.services.DepartmentService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository repository;

    public DepartmentServiceImpl(DepartmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Department> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Department> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Department create(Department department) {
        return repository.save(department);
    }

    /**
     * Updates an existing department.
     * @param id The ID of the department to update.
     * @param updated The department data to update.
     * @return The updated department if found or empty, wrapped in Optional.
     * @throws IllegalArgumentException if the ID is null.
     */
    @Override
    @Transactional
    public Optional<Department> update(Long id, Department updated) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return repository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            return repository.save(existing);
        });
    }

    /**
     * Deletes a department by its ID.
     * @param id The ID of the department to delete.
     * @throws EntityNotFoundException if the department with the given ID does not exist.
     * @throws IllegalArgumentException if the ID is null.
     */
    @Override
    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        Department department = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));

        repository.delete(department);
        try {
            repository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Cannot delete department with id " + id + " due to existing references.");
        }
    }
}