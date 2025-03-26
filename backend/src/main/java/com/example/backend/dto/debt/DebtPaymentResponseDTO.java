package com.example.backend.dto.debt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtPaymentResponseDTO {
    private Long id;
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String receiptNumber;
    private String notes;
    private LocalDateTime createdAt;
}