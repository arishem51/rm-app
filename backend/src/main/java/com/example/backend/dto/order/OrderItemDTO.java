package com.example.backend.dto.order;

import java.math.BigDecimal;
import com.example.backend.entities.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long inventoryId;
    private Long zoneId;
    private Long productId;
    private BigDecimal productPrice;
    private String productName;
    private Integer quantity;

    public static OrderItemDTO fromEntity(OrderItem item) {
        return OrderItemDTO.builder()
                .productId(item.getProductId())
                .productPrice(item.getProductPrice())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .build();
    }
}
