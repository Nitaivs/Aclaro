package com.proseed.services.impl;

import com.proseed.entities.Role;
import com.proseed.repos.RoleRepository;
import com.proseed.services.RoleService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {
    RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Role> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Role> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Role create(Role role) {
        return repository.save(role);
    }

    @Override
    @Transactional
    public Optional<Role> update(Long id, Role updated) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return repository.findById(id).map(existing -> {
            existing.setRoleName(updated.getRoleName());
            return repository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }

        Role role = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Role with ID " + id + " not found"));

        repository.delete(role);
        try {
            repository.flush();
            return true;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Cannot delete role with ID " + id + " due to existing references");
        }
    }
}