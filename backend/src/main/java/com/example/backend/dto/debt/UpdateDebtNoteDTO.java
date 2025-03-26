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
    private Long partnerId;
    private Double amount;
    private LocalDate dueDate;
    private DebtStatus status;
    private String description;
    private List<String> attachments;
    private String notes;
}