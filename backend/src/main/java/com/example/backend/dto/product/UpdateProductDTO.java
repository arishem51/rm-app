package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import com.example.backend.enums.UnitType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductDTO {

    @NotBlank(message = "Product name cannot be empty")
    private String name;

    private String description;

    private Long categoryId;

    private Long supplierId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Sale price must be greater than zero")
    private BigDecimal salePrice;

    @DecimalMin(value = "0.0", inclusive = false, message = "Wholesale price must be greater than zero")
    private BigDecimal wholesalePrice;

    @DecimalMin(value = "0.0", message = "Stock quantity cannot be negative")
    private BigDecimal stockQuantity;

    @DecimalMin(value = "0.0", message = "Low stock alert cannot be negative")
    private BigDecimal lowStockAlert;

    @NotNull
    private UnitType unit;

    private List<String> imageUrls;
}
