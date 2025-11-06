package com.proseed.services;

import com.proseed.entities.ProcessEntity;
import java.util.List;
import java.util.Optional;
import com.proseed.DTOs.ProcessDTO;

public interface ProcessService {
    List<ProcessDTO> findAll();
    Optional<ProcessEntity> findById(Long id);
    ProcessEntity create(ProcessEntity process);
    Optional<ProcessDTO> update(Long id, ProcessEntity updatedProcess);
    boolean delete(Long id);
    ProcessDTO getProcessWithTaskIds(Long id);
}
