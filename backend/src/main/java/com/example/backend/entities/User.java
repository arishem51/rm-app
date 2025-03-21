package com.example.backend.entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import com.example.backend.enums.ActionStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(required = true)
    private Long id;

    @Column(nullable = false, unique = true)
    @Schema(required = true)
    private String username;

    @Column
    private String email;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    @Schema(required = true)
    private String name;

    @Column(nullable = false, unique = true)
    @Schema(required = true)
    private String phoneNumber;

    @Column(nullable = false)
    @JsonIgnore
    @Schema(required = true)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(required = true)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    @Schema(required = true)
    @Builder.Default
    private ActionStatus status = ActionStatus.ACTIVE;

    @ManyToOne()
    @JoinColumn(name = "shop_id")
    @Schema(hidden = true)
    @JsonIgnore
    private Shop shop;

    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "'}";
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return status == ActionStatus.ACTIVE;
    }
}
