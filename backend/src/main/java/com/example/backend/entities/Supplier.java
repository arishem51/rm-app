package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "contract_name", nullable = false)
    private String contractName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(name = "tax_id", nullable = false)
    private String taxId;

    @Column(nullable = false)
    private String address;

    @Column()
    private String website;

    @Column(name = "total_debt", nullable = false)
    private int totalDebt;

    @Column(name = "last_order_date", nullable = false)
    private LocalDateTime lastOrderDate;

    @Column()
    private String notes;

}
