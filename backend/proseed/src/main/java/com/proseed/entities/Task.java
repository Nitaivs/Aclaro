package com.proseed.entities;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
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
}
