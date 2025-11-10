package com.proseed.entities;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
//import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "privilege_id", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long privilegeId;

    /* Commented out for now; can be re-enabled if role-privilege mapping is needed in the future.
    @ManyToMany(mappedBy = "privileges", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Role> roles;
    */
}
