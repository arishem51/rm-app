package com.example.backend.entities;

import com.example.backend.enums.DebtStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebtNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    private Partner partner;

    private Double amount;
    private Double paidAmount = 0.0;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    private DebtStatus status = DebtStatus.PENDING;
    
    private String source; // ORDER or MANUAL
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    private String description;
    
    @ElementCollection
    private List<String> attachments = new ArrayList<>();
    
    private String notes;
    
    @OneToMany(mappedBy = "debtNote", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DebtPayment> payments = new ArrayList<>();
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
} 