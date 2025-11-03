package com.proseed.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

import com.proseed.entities.Task;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessWithTaskInfoDTO {
    private Long processId;
    private List<Task> tasks;
}