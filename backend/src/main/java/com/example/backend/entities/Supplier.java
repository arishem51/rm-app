package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "contact_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String contactName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(name = "tax_id", nullable = false)
    private String taxId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column()
    private String website;

    @Column()
    private String notes;

}
