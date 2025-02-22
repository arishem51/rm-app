package com.example.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import com.example.backend.enums.UnitType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = true)
    private Supplier supplier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitType unit;

    @Column(name = "sale_price")
    private BigDecimal salePrice;

    @Column(name = "wholesale_price")
    private BigDecimal wholesalePrice;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "image_urls")
    private List<String> imageUrls;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Product{id=" + id
                + ", name='" + name + '\''
                + ", category='" + (category != null ? category.getName() : "null") + '\''
                + ", supplier='" + (supplier != null ? supplier.getName() : "null") + '\''
                + ", unit='" + unit + '\''
                + ", salePrice='" + salePrice + '\''
                + "} ";
    }
}
