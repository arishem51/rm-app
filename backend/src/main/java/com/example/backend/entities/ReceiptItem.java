package com.example.backend.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "receipt_items")
public class ReceiptItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", columnDefinition = "NVARCHAR(255)")
    private String productName;

    @Column(name = "product_price")
    private BigDecimal productPrice;

    @ManyToOne(optional = false)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    @Column(name = "zone_id")
    private Long zoneId;
    @Column(name = "zone_name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String zoneName;

    @Column(name = "warehouse_id")
    private Long warehouseId;
    @Column(name = "warehouse_name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String warehouseName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

}
