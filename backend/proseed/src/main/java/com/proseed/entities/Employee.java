package com.proseed.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
public class Employee {
    @Id
    @Column(nullable = false, unique = true)
    private Long employeeId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @ManyToMany(mappedBy = "employees")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Task> tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Role role;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "employee_skills_mapping",
        joinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "employeeId"),
        inverseJoinColumns = @JoinColumn(name = "skill_id", referencedColumnName = "skillId")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<EmployeeSkill> employeeSkills;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private EmployeeProfile profile;
}
