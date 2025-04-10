package com.example.backend.dto.debt;

import com.example.backend.enums.DebtStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtNoteResponseDTO implements Serializable {

    private Long id;
    private Long partnerId;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private DebtStatus status;
    private String source;
    private String description;

}
