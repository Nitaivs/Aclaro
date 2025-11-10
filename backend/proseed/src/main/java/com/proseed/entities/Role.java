package com.proseed.entities;
import java.util.Set;

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
    private Long roleId;

    @Column(nullable = false, unique = true, length = 100)

    private String roleName;

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

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Employee> employees;
}
