package com.example.backend.dto.debt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebtStatisticsDTO {
    private Double totalOutstanding;
    private Double overdueAmount;
    private Double upcomingPayments;
} 