package com.example.backend.dto.debtdetail;

import com.example.backend.enums.DebtStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebtDetailResponseDTO {
    private Long id;
    private LocalDateTime createdAt;
    private Boolean isPlus;
    private Double amount;
    private String description;
    private Long partnerId;
}

