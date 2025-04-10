package com.example.backend.dto.inventory;

import com.example.backend.dto.UserDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.Product;
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
public class InventoryResponseDTO {
    private Long id;
    private Long zoneId;
    private String zoneName;
    private Long warehouseId;
    private UserDTO createdBy;
    private String createdAt;
    private String updatedAt;
    private String warehouseName;
    private Integer quantity;
    private Product product;
    private Integer packageValue;

    public static InventoryResponseDTO fromEntity(Inventory inventory) {
        return InventoryResponseDTO.builder()
                .id(inventory.getId())
                .product(inventory.getProduct())
                .zoneId(inventory.getZone().getId())
                .zoneName(inventory.getZone().getName())
                .warehouseId(inventory.getZone().getWarehouse().getId())
                .warehouseName(inventory.getZone().getWarehouse().getName())
                .createdBy(UserDTO.fromEntity(inventory.getCreatedBy()))
                .createdAt(inventory.getCreatedAt().toString())
                .updatedAt(inventory.getUpdatedAt() != null ? inventory.getUpdatedAt().toString() : null)
                .quantity(inventory.getQuantity())
                .packageValue(inventory.getPackageValue())
                .build();
    }
}
