package com.example.backend.dto.warehouse;

import lombok.*;

/**
 * DTO dùng để cập nhật một Warehouse.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseUpdateDTO {
    private String name;
    private String location;
}
