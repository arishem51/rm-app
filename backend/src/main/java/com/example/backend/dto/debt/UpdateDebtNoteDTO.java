package com.example.backend.dto.debt;

import com.example.backend.enums.DebtStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDebtNoteDTO {
    private Long partnerId;  // ID của đối tác
    private Double totalAmount;  // Tổng số nợ
    private String source;  // Nguồn nợ (ORDER hoặc MANUAL)
    private String description;  // Mô tả về nợ
    private Long orderId;  // ID của đơn hàng liên quan (nếu có)
    private DebtStatus status = DebtStatus.PENDING;  // Trạng thái nợ, mặc định là PENDING
}