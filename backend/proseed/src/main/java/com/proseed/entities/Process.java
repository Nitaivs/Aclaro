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
public class Process {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processId;

    @Column(nullable = false)
    private String processName;
}
