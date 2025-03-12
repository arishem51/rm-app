package com.example.backend.dto.statistics;

import java.math.BigDecimal;

import com.example.backend.entities.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class RecentOrder {
    private String userName;
    private BigDecimal totalAmount;

    public static RecentOrder fromEntity(Order order) {
        return RecentOrder.builder()
                .userName(order.getUser().getName())
                .totalAmount(order.getTotalAmount())
                .build();
    }
}
