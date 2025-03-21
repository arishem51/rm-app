package com.example.backend.dto.statistics;

import java.math.BigDecimal;
import java.util.Optional;
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
                .userName(order.getCreatedBy().getName())
                .totalAmount(
                        Optional.ofNullable(order.getAmount())
                                .map(amount -> BigDecimal.valueOf(amount.intValue()))
                                .orElse(BigDecimal.ZERO))
                .build();
    }
}
