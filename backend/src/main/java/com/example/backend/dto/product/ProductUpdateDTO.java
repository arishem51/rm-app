package com.example.backend.dto.product;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateDTO {
    @NotBlank(message = "Name is required!")
    private String name;
    private String description;
    private Long categoryId;
    private Long supplierId;

    @NotNull(message = "Shop ID is required!")
    private Long shopId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @Schema(description = "Unit of the product (unit kg/bg)", example = "10", type = "integer", format = "int32")
    private Integer unit;
    private List<String> imageUrls;
}
