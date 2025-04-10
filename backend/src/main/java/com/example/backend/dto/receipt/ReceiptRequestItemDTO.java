package com.example.backend.dto.receipt;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
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
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
    @Min(value = 1, message = "Quy cách phải lớn hơn 0")
    private Integer packageValue;
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị phải lớn hơn 0")
    private BigDecimal price;
    private Long zoneId;
}
