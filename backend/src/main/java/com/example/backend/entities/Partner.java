package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "partners")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Partner implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "contact_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String contactName;

    @Column(nullable = false)
    private String phone;

    @Column()
    @Builder.Default
    private Double totalDebtAmount = (double) 0;

    @Column()
    private String email;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column()
    private String website;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "can_have_debt", nullable = false)
    private boolean canHaveDebt;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
