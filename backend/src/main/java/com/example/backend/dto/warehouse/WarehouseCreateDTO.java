package com.example.backend.dto.warehouse;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseCreateDTO {
    private String name;
    private String address;
    @NotNull(message = "Shop ID cannot be null")
    private Long shopId;
}
