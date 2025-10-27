package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}