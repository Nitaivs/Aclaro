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
public class TaskDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean completed;
    private List<Long> employeeIds;
    private List<TaskDTO> subTasks;
    private Long parentTaskId;
    private Long processId;
    private List<SkillDTO> skills;
    private List<DepartmentDTO> departments;
}
