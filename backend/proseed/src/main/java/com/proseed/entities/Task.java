package com.proseed.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "process_id", nullable = false,
                foreignKey = @ForeignKey(name = "FK_TASK_PROCESS"))
    private Process process;

    @Column(nullable = false)
    private String taskName;

    @Column(length = 1000)
    private String taskDescription;

    @Column(nullable = false)
    private boolean isCompleted; // This can be changed later for more states

    @ManyToMany
    @JoinTable(
        name = "task_assignees",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> employees;
}
