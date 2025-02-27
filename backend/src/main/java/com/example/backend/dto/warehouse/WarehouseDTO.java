package com.example.backend.dto.warehouse;

import java.time.LocalDateTime;

import com.example.backend.entities.Warehouse;

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
    private String address;
    private Long shopId;
    private Long id;
    private String shopName;
    private LocalDateTime createdAt;

    public static WarehouseDTO fromEntity(Warehouse warehouse) {
        return WarehouseDTO.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .shopId(warehouse.getShop().getId())
                .shopName(warehouse.getShop().getName())
                .createdAt(warehouse.getCreatedAt())
                .build();
    }
}
