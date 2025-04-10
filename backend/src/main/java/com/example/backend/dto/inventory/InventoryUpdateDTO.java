package com.example.backend.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class InventoryUpdateDTO {
    private Long productId;
    private Long zoneId;
    private Integer quantity;
    private Integer packageValue;
}
