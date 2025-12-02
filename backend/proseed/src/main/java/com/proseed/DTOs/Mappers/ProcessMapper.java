package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.ProcessDTO;
import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import com.proseed.DTOs.TaskDTO;
import com.proseed.DTOs.ProcessWithTaskInfoDTO;
import java.util.List;
import java.util.stream.Collectors;

public class ProcessMapper {
    /**
     * Creates a ProcessDTO with task IDs.
     * @param processEntity
     * @return ProcessDTO
     */
    public static ProcessDTO toDTO(ProcessEntity processEntity) {
        return new ProcessDTO(
            processEntity.getId(),
            processEntity.getName(),
            processEntity.getDescription(),
            /* If tasks exist, maps their IDs. Otherwise, returns an empty list. */
            processEntity.getTasks() != null
                ? processEntity.getTasks().stream().map(Task::getId)
                                .collect(Collectors.toList())
                : List.of()
        );
    }

    public static ProcessWithTaskInfoDTO toProcessWithTaskInfoDTO(ProcessEntity processEntity) {
        List<TaskDTO> taskDtos = processEntity.getTasks() != null
            ? processEntity.getTasks().stream()
                .filter(t -> t.getParentTask() == null) // only top-level tasks
                .map(TaskMapper::toTaskDTO)
                .collect(Collectors.toList())
            : List.of();
        return new ProcessWithTaskInfoDTO(
            processEntity.getId(),
            taskDtos
        );
    }
}
