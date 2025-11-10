package com.proseed.controllers;

import com.proseed.DTOs.ProcessDTO;
import com.proseed.entities.ProcessEntity;
import com.proseed.services.ProcessService;
import com.proseed.DTOs.ProcessWithTaskInfoDTO;

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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/processes")
public class ProcessController {
    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @GetMapping
    public ResponseEntity<List<ProcessDTO>> getAllProcesses() {
        return ResponseEntity.ok(processService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProcessWithTaskIds(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(processService.getProcessWithTaskIds(id));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<?> getProcessWithTaskInfo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(processService.getProcessWithTaskInfo(id));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @PostMapping
    public ResponseEntity<ProcessEntity> createProcess(@RequestBody ProcessEntity process) {
        ProcessEntity saved = processService.create(process);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcessDTO> updateProcess(@PathVariable Long id,
                                    @RequestBody ProcessEntity updatedProcess)
    {
        return processService.update(id, updatedProcess)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        return processService.delete(id)
            ? ResponseEntity.noContent().build()
            : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
