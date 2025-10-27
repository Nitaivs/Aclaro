package com.proseed.entities;
import java.util.Collection;

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
    private Long roleId;

    @Column(nullable = false, unique = true, length = 100)

    private String roleName;

    @ManyToMany(fetch = FetchType.LAZY) // Nullable for roles without any privileges
    @JoinTable(
        name = "role_privileges",
        joinColumns = @JoinColumn(name = "role_id",
                                referencedColumnName = "roleId"),
        inverseJoinColumns = @JoinColumn(name = "privilege_id",
                                        referencedColumnName = "privilegeId")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Collection<Privilege> privileges;
}
