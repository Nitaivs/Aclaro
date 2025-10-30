package com.proseed.controllers;

import com.proseed.entities.ProcessEntity;
import com.proseed.repos.ProcessRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
public class ProcessController {
    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @GetMapping
    public ResponseEntity<List<ProcessEntity>> getAllProcesses() {
        return ResponseEntity.ok(processService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcessEntity> getProcessById(@PathVariable Long id) {
        return processService.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ProcessEntity createProcess(@RequestBody ProcessEntity process) {
        return processRepository.save(process);
    }

    @PutMapping("/{id}")
    public ProcessEntity updateProcess(@PathVariable Long id,
                                    @RequestBody ProcessEntity updatedProcess)
    {
        return processRepository.findById(id)
            .map(existing -> {
                existing.setProcessName(updatedProcess.getProcessName());
                return processRepository.save(existing);
            })
            .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteProcess(@PathVariable Long id) {
        processRepository.deleteById(id);
    }
}