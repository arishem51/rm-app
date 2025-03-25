package com.example.backend.dto.zone;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ZoneRequestDTO {
    private String name;
    private String description;
    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;
}
