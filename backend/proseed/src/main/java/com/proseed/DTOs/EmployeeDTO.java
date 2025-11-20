package com.proseed.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private com.proseed.entities.Department department; // Contains id and name
    private com.proseed.DTOs.RoleDTO role; // Contains id and name
    private List<com.proseed.DTOs.SkillDTO> skills; // Contains id and name
}
