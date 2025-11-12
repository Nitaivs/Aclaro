package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.Privilege;

public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
}
