package com.example.backend.entities;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", columnDefinition = "NVARCHAR(255)")
    private String productName;

    @Column(name = "product_price")
    private BigDecimal productPrice;

    @Column(name = "zone_id", nullable = false)
    private Long zoneId;
    @Column(name = "zone_name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String zoneName;

    @Column(nullable = false)
    private Integer quantity;

}
