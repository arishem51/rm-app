package com.example.backend.dto.product;

import java.util.List;

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
public class ProductRequestDTO {
    @NotBlank(message = "Name is required!")
    private String name;
    private String description;
    private Long categoryId;
    private Long supplierId;

    @NotNull(message = "Shop ID is required!")
    private Long shopId;

    private List<String> imageUrls;
}
