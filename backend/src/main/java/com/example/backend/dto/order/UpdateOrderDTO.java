package com.example.backend.dto.order;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderDTO {
    private  long partnerId;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> orderItems;
}