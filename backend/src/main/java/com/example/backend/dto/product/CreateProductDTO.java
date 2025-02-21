package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    private Long categoryId;

    private Long supplierId;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Purchase price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Purchase price must be greater than zero")
    private BigDecimal purchasePrice;

    @NotNull(message = "Sale price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Sale price must be greater than zero")
    private BigDecimal salePrice;

    @DecimalMin(value = "0.0", inclusive = false, message = "Wholesale price must be greater than zero")
    private BigDecimal wholesalePrice;

    @DecimalMin(value = "0.0", message = "Stock quantity cannot be negative")
    private BigDecimal stockQuantity;

    @DecimalMin(value = "0.0", message = "Low stock alert cannot be negative")
    private BigDecimal lowStockAlert;

    private String imageUrl;
}
