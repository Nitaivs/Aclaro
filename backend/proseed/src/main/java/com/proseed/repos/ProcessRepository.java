package com.proseed.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proseed.entities.Process;

public interface ProcessRepository extends JpaRepository<Process, Long> {
}
