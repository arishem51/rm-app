package com.example.backend.dto.debt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtStatisticsDTO {
    private Double totalOutstanding;  // Tổng nợ chưa thanh toán
    private Double overdueAmount;     // Tổng nợ quá hạn
    private Double upcomingPayments;  // Tổng nợ sắp đến hạn
}