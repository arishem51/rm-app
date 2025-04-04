package com.example.backend.dto.inventory;

import java.time.LocalDateTime;
import com.example.backend.dto.UserDTO;
import com.example.backend.entities.InventoryHistory;
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
public class InventoryHistoryResponseDTO {
    private Long id;
    private String reason;
    private UserDTO createdBy;
    private LocalDateTime createdAt;
    private String productName;
    private String zoneName;
    private String warehouseName;
    private Integer quantity;
    private Integer packageValue;

    public static InventoryHistoryResponseDTO fromEntity(InventoryHistory dto) {
        return InventoryHistoryResponseDTO.builder()
                .id(dto.getId())
                .createdBy(UserDTO.fromEntity(dto.getCreatedBy()))
                .createdAt(dto.getCreatedAt())
                .reason(dto.getReason())
                .productName(dto.getProduct().getName())
                .zoneName(dto.getZone().getName())
                .warehouseName(dto.getZone().getWarehouse().getName())
                .quantity(dto.getQuantity())
                .packageValue(dto.getPackageValue())
                .build();

    }
}
