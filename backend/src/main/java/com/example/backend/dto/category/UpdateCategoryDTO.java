package com.example.backend.dto.category;

import com.example.backend.enums.ActionStatus;
import com.example.backend.security.validation.ValidEnum;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCategoryDTO {
    private String name;
    private String description;
    private String imageUrl;
    @ValidEnum(enumClass = ActionStatus.class, message = "Invalid status!")
    private String status;
}
