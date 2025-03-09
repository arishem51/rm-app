package com.example.backend.dto.payment;

import com.example.backend.dto.order.OrderItemDTO;
import com.example.backend.entities.OrderItem;
import com.example.backend.entities.PaymentHistory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryDetailDTO {
    private Long id;
    private String partnerName;
    private String partnerPhone;
    private BigDecimal orderAmount;
    private BigDecimal discount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private boolean isDebt;
    private List<OrderItemDTO> orderItems;
    private LocalDateTime createdAt;

    public static PaymentHistoryDetailDTO fromEntity(PaymentHistory paymentHistory) {
        return  PaymentHistoryDetailDTO.builder()
                .id(paymentHistory.getId())
                .partnerName(paymentHistory.getOrder().getPartner().getName())
                .partnerPhone(paymentHistory.getOrder().getPartner().getPhone())
                .orderAmount(paymentHistory.getOrder().getTotalAmount())
                .discount(paymentHistory.getDiscount())
                .shippingFee(paymentHistory.getShippingFee())
                .totalAmount(paymentHistory.getTotalAmount())
                .isDebt(paymentHistory.isDebt())
                .createdAt(paymentHistory.getOrder().getCreatedAt())
                .orderItems(paymentHistory.getOrder().getOrderItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
    public static List<PaymentHistoryDetailDTO> fromEntity(List<PaymentHistory> orders) {
        return orders.stream()
                .map(PaymentHistoryDetailDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
