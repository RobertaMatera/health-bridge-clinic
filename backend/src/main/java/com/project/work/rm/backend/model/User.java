package com.project.work.rm.backend.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.project.work.rm.backend.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome è obbligatorio")
    @Size(min = 3, max = 50, message = "Nome deve essere tra 3 e 50 caratteri")
    @Column(unique = true, nullable = false)
    private String firstName;

    @NotBlank(message = "Cognome è obbligatorio")
    @Size(min = 3, max = 50, message = "Cognome deve essere tra 3 e 50 caratteri")
    @Column(unique = true, nullable = false)
    private String lastName;

    @NotBlank(message = "Email è obbligatoria")
    @Email(message = "Email deve essere valida")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password è obbligatoria")
    @Size(min = 6, message = "Password deve avere almeno 6 caratteri")
    @Column(nullable = false)
    private String password;

    @NotNull(message = "Ruolo è obbligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column()
    private LocalDateTime updatedAt;

    @Override
    @NullMarked
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    @NullMarked
    public String getUsername() {
        return email;
    }
}   