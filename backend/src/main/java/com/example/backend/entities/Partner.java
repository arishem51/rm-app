package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "partners")
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "contact_name", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String contactName;

    @Column(nullable = false)
    private String phone;

    @Column()
    private String email;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column()
    private String website;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;
}
