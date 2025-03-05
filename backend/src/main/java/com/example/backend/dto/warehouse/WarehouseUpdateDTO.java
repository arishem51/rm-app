package com.example.backend.dto.warehouse;

import com.example.backend.enums.ActionStatus;
import com.example.backend.security.validation.ValidEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseUpdateDTO {
    private String name;
    private String address;

    @ValidEnum(enumClass = ActionStatus.class, message = "Invalid status!")
    private String status;
}
