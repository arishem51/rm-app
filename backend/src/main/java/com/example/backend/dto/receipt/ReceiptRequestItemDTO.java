package com.example.backend.dto.receipt;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptRequestItemDTO {

    private Long productId;
    @Min(value = 1, message = "Quantity must be greater than zero")
    private Integer quantity;
    private Long zoneId;
}
