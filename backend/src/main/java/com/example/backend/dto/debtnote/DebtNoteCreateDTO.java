package com.example.backend.dto.debtnote;

import com.example.backend.enums.TransactionType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DebtNoteCreateDTO {

    @NotNull(message = "Partner ID is required")
    private Long partnerId;

    @NotEmpty(message = "Description is required")
    private String description;

    @NotNull(message = "Transaction type is required")
    private TransactionType transactionType; // Sử dụng enum thay vì String

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String imageUrl;
}
