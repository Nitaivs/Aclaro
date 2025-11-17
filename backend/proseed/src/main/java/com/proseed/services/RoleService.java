package com.proseed.services;

import com.proseed.entities.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {
    List<Role> findAll();
    Optional<Role> findById(Long id);
    Role create(Role role);
    Optional<Role> update(Long id, Role role);
    boolean delete(Long id);
}
