package com.example.backend.dto.warehouse;

import java.time.LocalDateTime;
import com.example.backend.entities.Warehouse;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseDTO {
    private String name;
    private String description;
    private String address;
    private Long shopId;
    private Long id;
    private String shopName;
    @NotNull
    private String status;
    private LocalDateTime createdAt;
    private Integer numberOfZone;

    public static WarehouseDTO fromEntity(Warehouse warehouse, int zoneCount) {
        return WarehouseDTO.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .description(warehouse.getDescription())
                .address(warehouse.getAddress())
                .shopId(warehouse.getShop().getId())
                .shopName(warehouse.getShop().getName())
                .createdAt(warehouse.getCreatedAt())
                .status(warehouse.getStatus().toString())
                .numberOfZone(zoneCount)
                .build();
    }
}
