package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.ProcessDTO;
import com.proseed.entities.ProcessEntity;
import com.proseed.entities.Task;
import java.util.List;
import java.util.stream.Collectors;

public class ProcessMapper {
    public static ProcessDTO toDTO(ProcessEntity processEntity) {
        return new ProcessDTO(
            processEntity.getProcessId(),
            processEntity.getProcessName(),
            /* If tasks exist, maps their IDs. Otherwise, returns an empty list. */
            processEntity.getTasks() != null
                ? processEntity.getTasks().stream().map(Task::getTaskId)
                                .collect(Collectors.toList())
                : List.of()
        );
    }
}
