package com.proseed.controllers;

import com.proseed.entities.ProcessEntity;
import com.proseed.repos.ProcessRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
public class ProcessController {
    private final ProcessRepository processRepository;

    public ProcessController(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    @GetMapping
    public List<ProcessEntity> getAllProcesses() {
        return processRepository.findAll();
    }

    @GetMapping("/{id}")
    public ProcessEntity getProcessById(@PathVariable Long id) {
        return processRepository.findById(id).orElse(null);
    }
}