package com.example.backend.dto.inventory;

import com.example.backend.dto.UserDTO;
import com.example.backend.entities.Inventory;

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
    private Long productId;
    private Long zoneId;
    private String zoneName;
    private Long warehouseId;
    private String productName;
    private UserDTO createdBy;
    private String createdAt;
    private String updatedAt;
    private String price;
    private String warehouseName;
    private Integer quantity;

    public static InventoryResponseDTO fromEntity(Inventory inventory) {
        return InventoryResponseDTO.builder()
                .id(inventory.getId())
                .price(inventory.getProductPrice().toString())
                .productId(inventory.getProduct().getId())
                .zoneId(inventory.getZone().getId())
                .zoneName(inventory.getZone().getName())
                .productName(inventory.getProduct().getName())
                .warehouseId(inventory.getZone().getWarehouse().getId())
                .warehouseName(inventory.getZone().getWarehouse().getName())
                .createdBy(UserDTO.fromEntity(inventory.getCreatedBy()))
                .createdAt(inventory.getCreatedAt().toString())
                .updatedAt(inventory.getUpdatedAt() != null ? inventory.getUpdatedAt().toString() : null)
                .quantity(inventory.getQuantity())
                .build();
    }
}
