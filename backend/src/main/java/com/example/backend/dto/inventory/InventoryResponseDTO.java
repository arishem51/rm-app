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
    private Long warehouseId;
    private Integer quantity;
    private String productName;
    private String warehouseName;
    private UserDTO createdBy;
    private String createdAt;
    private String updatedAt;
    private String price;
    public static InventoryResponseDTO fromEntity(Inventory inventory) {
        return InventoryResponseDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .warehouseId(inventory.getWarehouse().getId())
                .quantity(inventory.getQuantity())
                .productName(inventory.getProduct().getName())
                .warehouseName(inventory.getWarehouse().getName())
                .createdBy(UserDTO.fromEntity(inventory.getCreatedBy()))
                .createdAt(inventory.getCreatedAt().toString())
                .updatedAt(inventory.getUpdatedAt() != null ? inventory.getUpdatedAt().toString() : null)
                .price(inventory.getProduct().getSalePrice().toString())
                .build();
    }
}
