package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.example.backend.enums.RequestStatus;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_create_requests")
public class ProductCreateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy; // Người gửi request (staff)

    private String productName;
    private String description;
    private Long categoryId;
    private Long supplierId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status; // PENDING, APPROVED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
