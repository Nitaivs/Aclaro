package com.proseed.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JsonIgnore // Prevent recursion
    @JoinColumn(name = "process_id", nullable = false,
                foreignKey = @ForeignKey(name = "FK_TASK_PROCESS"))
    private ProcessEntity process;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean isCompleted; // This can be changed later for more states

    @ManyToMany
    @JsonIgnore // Prevent recursion
    @JoinTable(
        name = "task_assignees",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> employees;

    // Self-references other tasks, can have zero or more sub-tasks
    // and a sub-task references its parent Task.
    @JsonIgnore // avoid recursion during basic serialization
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id", foreignKey = @ForeignKey(name = "FK_TASK_PARENT"))
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Task> subTasks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore // Prevent recursion
    @JoinTable(
        name = "task_skills_mapping",
        joinColumns = @JoinColumn(name = "task_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id", referencedColumnName = "skill_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<EmployeeSkill> skills;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore // Prevent recursion
    @JoinTable(
        name = "task_departments_mapping",
        joinColumns = @JoinColumn(name = "task_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "department_id", referencedColumnName = "department_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Department> departments;
}
