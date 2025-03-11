package com.example.backend.entities;

import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "receipt")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "partner_id", nullable = true)
    private Partner partner;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String partnerName;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

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

    @ElementCollection
    @CollectionTable(name = "receipt_products", joinColumns = @JoinColumn(name = "receipt_id"))
    @Column(name = "product_details", nullable = false, columnDefinition = "NVARCHAR(255)")
    private List<String> products; 

    @Column(nullable = false)
    private double totalAmount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateTotal(); 
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotal(); 
    }

    private void calculateTotal() {
        double total = 0;
        for (String product : products) {
            String[] details = product.split(","); 
            // Format: "ProductName, Unit, Quantity, UnitPrice"
            if (details.length == 4) {
                int quantity = Integer.parseInt(details[2].trim());
                double unitPrice = Double.parseDouble(details[3].trim());
                total += quantity * unitPrice;
            }
        }
        this.totalAmount = total;
    }

    @Override
    public String toString() {
        return "Receipt{" +
                "id=" + id +
                ", shop=" + shop.toString() +
                ", partner=" + (partner != null ? partner.getName() : partnerName) + // Nếu có partner thì lấy từ DB, nếu không thì lấy trực tiếp
                ", createdBy=" + createdBy.getUsername() +
                ", createdAt=" + createdAt +
                ", products=" + products + // Hiển thị danh sách sản phẩm dưới dạng List<String>
                ", totalAmount=" + totalAmount +
                ", updatedAt=" + updatedAt +
                ", deletedAt=" + deletedAt +
                '}';
    }
}
