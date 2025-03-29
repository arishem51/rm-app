package com.example.backend.entities;

import com.example.backend.enums.DebtStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebtDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "debt_note_id", nullable = false)
    @JsonBackReference
    private DebtNote debtNote;

    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private String description;
    private Boolean isPlus;
    private Double amount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
