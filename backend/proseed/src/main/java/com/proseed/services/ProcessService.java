package com.proseed.services;

import com.proseed.entities.ProcessEntity;
import java.util.List;
import java.util.Optional;

public interface ProcessService {
    List<ProcessEntity> findAll();
    Optional<ProcessEntity> findById(Long id);
}
