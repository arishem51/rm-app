package com.example.backend.dto.warehouse;

import lombok.*;

/**
 * DTO dùng để tạo mới một Warehouse.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseCreateDTO {

    private String name;
    private String location;
    private Long adminId;  // Admin tạo kho
}
