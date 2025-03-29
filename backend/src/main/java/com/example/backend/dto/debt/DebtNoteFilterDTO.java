package com.example.backend.dto.debt;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DebtNoteFilterDTO {

    private String partnerName;
    private Double minTotalAmount;
    private Double maxTotalAmount;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;

}
