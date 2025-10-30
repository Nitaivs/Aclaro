package com.proseed.services.impl;

import com.proseed.entities.ProcessEntity;
import com.proseed.repos.ProcessRepository;
import com.proseed.services.ProcessService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
