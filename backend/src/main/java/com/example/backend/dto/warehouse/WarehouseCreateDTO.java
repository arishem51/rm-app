package com.example.backend.dto.warehouse;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseCreateDTO {
    private String name;
    private String address;
    private Long shopId;

}
