package com.example.backend.entities;

import com.example.backend.enums.DebtStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "debt_note")
public class DebtNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long partnerId;
    private Double totalAmount;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private DebtStatus status = DebtStatus.PENDING;
    private String source; // ORDER or MANUAL
    
    private String description;

    private String createdBy;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
} 