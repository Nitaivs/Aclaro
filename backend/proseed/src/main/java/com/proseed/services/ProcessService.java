package com.proseed.services;

import com.proseed.entities.ProcessEntity;
import java.util.List;
import java.util.Optional;
import com.proseed.DTOs.ProcessDTO;
import com.proseed.DTOs.ProcessWithTaskInfoDTO;

public interface ProcessService {
    List<ProcessDTO> findAll();
    Optional<ProcessEntity> findById(Long id);
    ProcessEntity create(ProcessEntity process);
    Optional<ProcessDTO> update(Long id, ProcessEntity updatedProcess);
    boolean delete(Long id);
    ProcessDTO getProcessWithTaskIds(Long id);
    ProcessWithTaskInfoDTO getProcessWithTaskInfo(Long id);
}
