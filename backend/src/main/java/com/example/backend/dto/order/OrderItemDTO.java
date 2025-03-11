package com.example.backend.dto.order;

import java.math.BigDecimal;
import java.util.List;

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
    private Long productId;
    private Integer quantity;
    private BigDecimal price;

    public static OrderItemDTO fromEntity(OrderItem item) {
        return OrderItemDTO.builder()
                .productId(item.getProduct().getId())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .build();
    }
}
