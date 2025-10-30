package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.repos.ProcessRepository;
import com.proseed.services.ProcessService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

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
}
