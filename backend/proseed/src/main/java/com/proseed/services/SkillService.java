package com.proseed.services;

import com.proseed.entities.EmployeeSkill;

import java.util.List;
import java.util.Optional;

public interface SkillService {
    List<EmployeeSkill> findAll();
    Optional<EmployeeSkill> findById(Long id);
    EmployeeSkill create(EmployeeSkill skill);
    Optional<EmployeeSkill> update(Long id, EmployeeSkill skill);
    boolean delete(Long id);
}