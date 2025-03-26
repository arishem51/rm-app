package com.example.backend.dto.debt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDebtPaymentDTO {
    private Double amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String receiptNumber;
    private String notes;
}