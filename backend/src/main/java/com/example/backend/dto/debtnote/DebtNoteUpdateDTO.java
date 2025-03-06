package com.example.backend.dto.debtnote;

import com.example.backend.enums.TransactionType;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DebtNoteUpdateDTO {

    private String description;

    private TransactionType transactionType; // Thêm transactionType vào DTO

    private BigDecimal amount;

    private String imageUrl;
}
