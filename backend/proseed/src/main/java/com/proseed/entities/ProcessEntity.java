package com.proseed.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
public class ProcessEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long processId;

    @Column(nullable = false)
    private String processName;

    @Column(nullable = true, length = 1000)
    private String processDescription;


    @JsonIgnore
    @OneToMany(mappedBy = "process", fetch = FetchType.LAZY,
                cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Collection<Task> tasks;

    @PreRemove
    private void preRemove() {
        if (tasks != null) {
            tasks.clear();
        }
    }
}
