package com.example.backend.dto.debt;

import com.example.backend.enums.DebtStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtNoteResponseDTO {
    private Long id;

    private Long partnerId;
    private String partnerName;
    private String partnerPhone;
    
    private Double amount;
    private Double paidAmount;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private DebtStatus status;
    private String source;
    
    // Thông tin đơn hàng cần thiết
    private Long orderId;
    private Double orderAmount;
    
    private String description;
    private List<String> attachments = new ArrayList<>();
    private String notes;
    
    // Danh sách thanh toán rút gọn
    private List<DebtPaymentResponseDTO> payments = new ArrayList<>();
}