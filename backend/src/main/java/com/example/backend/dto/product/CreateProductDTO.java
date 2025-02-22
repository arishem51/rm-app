package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import com.example.backend.enums.UnitType;
import java.util.List;
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

    @NotNull(message = "Sale price is required")
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
