package com.proseed.DTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeePatchDTO {
    private String firstName;
    private String lastName;
    private Long departmentId;
    private Long roleId;
    private List<Long> skillIds;
}
