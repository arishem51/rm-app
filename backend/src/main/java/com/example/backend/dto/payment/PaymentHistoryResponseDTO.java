package com.example.backend.dto.payment;

import com.example.backend.dto.UserDTO;
import com.example.backend.dto.inventory.InventoryResponseDTO;
import com.example.backend.dto.order.OrderResponseDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.Order;
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
public class PaymentHistoryResponseDTO {
    private Long id;
    private String partnerName;
    private String partnerPhone;
    private BigDecimal orderAmount;
    private BigDecimal discount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private boolean isDebt;
    public static PaymentHistoryResponseDTO fromEntity(PaymentHistory paymentHistory) {
        return  PaymentHistoryResponseDTO.builder()
                .id(paymentHistory.getId())
                .partnerName(paymentHistory.getOrder().getPartner().getName())
                .partnerPhone(paymentHistory.getOrder().getPartner().getPhone())
                .orderAmount(paymentHistory.getOrder().getTotalAmount())
                .discount(paymentHistory.getDiscount())
                .shippingFee(paymentHistory.getShippingFee())
                .totalAmount(paymentHistory.getTotalAmount())
                .isDebt(paymentHistory.isDebt())
                .createdAt(paymentHistory.getOrder().getCreatedAt())
                .build();
    }
    public static List<PaymentHistoryResponseDTO> fromEntity(List<PaymentHistory> orders) {
        return orders.stream()
                .map(PaymentHistoryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
