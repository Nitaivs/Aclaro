package com.proseed.DTOs;

import java.util.List;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDTO {
    private Long processId;
    private String processName;
    private List<Long> taskIds;
}