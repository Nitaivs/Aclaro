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
    private Long id;
    private String name;
    private String description;
    private List<Long> taskIds;
}