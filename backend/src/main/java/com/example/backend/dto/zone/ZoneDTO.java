package com.example.backend.dto.zone;

import java.time.LocalDateTime;

import com.example.backend.entities.Zone;
import com.example.backend.enums.ActionStatus;

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
public class ZoneDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long warehouseId;
    private String warehouseName;
    private ActionStatus status;
    private boolean hasInventory;

    public static ZoneDTO fromEntity(Zone zone) {
        return ZoneDTO.builder()
                .id(zone.getId())
                .name(zone.getName())
                .description(zone.getDescription())
                .hasInventory(zone.getInventory() == null)
                .createdAt(zone.getCreatedAt())
                .updatedAt(zone.getUpdatedAt())
                .warehouseId(zone.getWarehouse().getId())
                .warehouseName(zone.getWarehouse().getName())
                .status(zone.getStatus())
                .build();
    }
}
