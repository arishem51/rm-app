package com.example.backend.dto.order;

import com.example.backend.entities.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long id;
    private String partnerName;
    private String partnerPhone;
    private String userName;
    private Long shopId;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponseDTO fromEntity(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .partnerName(order.getPartner().getName())
                .partnerPhone(order.getPartner().getPhone())
                .userName(order.getCreatedBy().getUsername())
                .shopId(order.getShop() != null ? order.getShop().getId() : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public static List<OrderResponseDTO> fromEntity(List<Order> orders) {
        return orders.stream()
                .map(OrderResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
