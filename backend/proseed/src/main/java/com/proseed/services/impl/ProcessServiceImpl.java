package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.repos.ProcessRepository;
import com.proseed.services.ProcessService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.proseed.DTOs.Mappers.ProcessMapper;
import com.proseed.DTOs.ProcessDTO;

@Service
public class ProcessServiceImpl implements ProcessService {
    private final ProcessRepository repository;

    public ProcessServiceImpl(ProcessRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProcessEntity> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<ProcessEntity> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public ProcessEntity create(ProcessEntity process) {
        return repository.save(process);
    }

    @Override
    @Transactional
    public Optional<ProcessEntity> update(Long id, ProcessEntity updatedProcess) {
        return repository.findById(id).map(existing -> {
            existing.setProcessName(updatedProcess.getProcessName());
            return repository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return repository.findById(id).map(p -> { repository.delete(p); return true; }).orElse(false);
    }

    /**
     * Returns a ProcessDTO containing the process details along with a
     * list of associated task IDs.
     * @param id The ID of the process to retrieve.
     * @return ProcessDTO with task IDs.
     * @throws ResponseStatusException if the process is not found.
     */
    @Override
    public ProcessDTO getProcessWithTaskIds(Long id) {
        return repository.findById(id)
            .map(ProcessMapper::toDTO)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Process not found with id: " + id
            ));
    }
}
