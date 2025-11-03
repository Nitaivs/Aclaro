package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.ProcessDTO;
import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
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
            processEntity.getProcessId(),
            processEntity.getProcessName(),
            processEntity.getProcessDescription(),
            /* If tasks exist, maps their IDs. Otherwise, returns an empty list. */
            processEntity.getTasks() != null
                ? processEntity.getTasks().stream().map(Task::getTaskId)
                                .collect(Collectors.toList())
                : List.of()
        );
    }

    public static ProcessWithTaskInfoDTO toProcessWithTaskInfoDTO(ProcessEntity processEntity) {
        return new ProcessWithTaskInfoDTO(
            processEntity.getProcessId(),
            processEntity.getTasks() != null
                ? processEntity.getTasks().stream().collect(Collectors.toList())
                : List.of()
        );
    }
}
