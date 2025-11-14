package com.proseed.services.impl;

import com.proseed.entities.EmployeeSkill;
import com.proseed.services.SkillService;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;

import com.proseed.repos.EmployeeSkillRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class SkillServiceImpl implements SkillService {
    private final EmployeeSkillRepository repository;

    public SkillServiceImpl(EmployeeSkillRepository repository) {
        this.repository = repository;
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
            existing.setSkillName(skill.getSkillName());
            return repository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        EmployeeSkill skill = repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Skill not found with id: " + id)
        );

        // TODO: IMPLEMENT DELETE LOGIC
        return false;
    }
}
