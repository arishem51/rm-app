package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

import com.example.backend.enums.UnitType;
import com.example.backend.security.validation.ValidEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    @NotBlank(message = "Name is required!")
    private String name;
    private String description;
    private Long categoryId;
    private Long supplierId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Sale price must be greater than zero")
    private BigDecimal salePrice;
    @DecimalMin(value = "0.0", inclusive = false, message = "Wholesale price must be greater than zero")
    private BigDecimal wholesalePrice;

    @ValidEnum(enumClass = UnitType.class, message = "Invalid product unit!")
    private String unit;

    private List<String> imageUrls;
    private Integer quantity;
    private List<Long> warehouseIds;
}
