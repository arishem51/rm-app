package com.example.backend.dto.order;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {
    private Long partnerId;
    private String partnerName;
    private BigDecimal totalAmount;
    private BigDecimal sellAmount;
    private List<OrderItemDTO> orderItems;
}
