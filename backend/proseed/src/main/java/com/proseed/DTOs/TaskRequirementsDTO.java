package com.proseed.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

/**
 * DTO for updating task requirements (skills and departments) in a single request.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequirementsDTO {
    private List<Long> skillIds;
    private List<Long> departmentIds;
}
