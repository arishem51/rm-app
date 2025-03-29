package com.example.backend.dto.debtdetail;

import com.example.backend.enums.DebtStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDebtDetailDTO {
    private Long debtNoteId;
    private LocalDate dueDate;
    private Boolean isPlus;
    private Double amount;
    private String description;
}
