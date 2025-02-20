package com.example.backend.dto.product;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductDTO {
    private String name;
    private String description;
    private Long supplierId;
    private String supplierName;
}
