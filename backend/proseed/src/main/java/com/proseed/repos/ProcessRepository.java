package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.ProcessEntity;

public interface ProcessRepository extends JpaRepository<ProcessEntity, Long> {
}
