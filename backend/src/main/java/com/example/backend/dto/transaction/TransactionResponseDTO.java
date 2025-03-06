package com.example.backend.dto.transaction;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionResponseDTO {
         private Long id;
        private Long partnerId;
        private String partnerName;
        private String transactionType;
        private BigDecimal amount;
        private LocalDateTime createdAt;
        private String note;


}
