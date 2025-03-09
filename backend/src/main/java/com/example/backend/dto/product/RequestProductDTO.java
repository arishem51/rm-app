package com.example.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestProductDTO {

    @NotBlank(message = "Name is required!")
    private String name;
    private String description;
    private Long categoryId;
    private Long supplierId;

    @NotNull(message = "Shop ID is required!")
    private Long shopId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    private Integer unit;
    private List<String> imageUrls;
}
