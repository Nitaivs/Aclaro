package com.proseed.entities;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)

    private String name;

    /* This section is commented out for now; can be re-enabled if role-privilege mapping is needed in the future.
    @ManyToMany(fetch = FetchType.LAZY) // Nullable for roles without any privileges
    @JoinTable(
        name = "role_privileges",
        joinColumns = @JoinColumn(name = "role_id",
                                referencedColumnName = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "privilege_id",
                                        referencedColumnName = "privilege_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Privilege> privileges;
    */

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<Employee> employees;
}
