package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.SkillDTO;
import com.proseed.entities.EmployeeSkill;

public class SkillMapper {
    public static SkillDTO toSkillDTO(EmployeeSkill skill) {
        return new SkillDTO(
            skill.getId(),
            skill.getName()
        );
    }
}
