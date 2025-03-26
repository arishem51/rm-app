package com.example.backend.dto.debt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDebtNoteDTO {
    private Long partnerId;
    private Double amount;
    private LocalDate dueDate;
    private String source;
    private Long orderId;
    private String description;
    private List<String> attachments;
    private String notes;
}