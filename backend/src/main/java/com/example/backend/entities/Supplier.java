package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
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

    @Column(name = "tax_code", nullable = false)
    @NotEmpty(message = "Tax code is required")
    @Pattern(regexp = "\\d{10}|\\d{13}", message = "Invalid tax code format")
    private String taxCode;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column()
    private String website;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;
}
