package com.proseed.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.List;

import com.proseed.entities.EmployeeSkill;
import com.proseed.services.SkillService;

@CrossOrigin
@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeSkill>> getAllSkills() {
        return ResponseEntity.ok(skillService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeSkill> getSkillById(@PathVariable Long id) {
        return skillService.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmployeeSkill> createSkill(@RequestBody EmployeeSkill skill) {
        try {
            EmployeeSkill createdSkill = skillService.create(skill);
            return ResponseEntity.status(201).body(createdSkill);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeSkill> updateSkill(@PathVariable Long id, @RequestBody EmployeeSkill skill) {
        return skillService.update(id, skill)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        try {
            return skillService.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}