package com.example.backend.dto.category;

import lombok.*;

/**
 * DTO dùng để tạo mới một Category.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCategoryDTO {
    private String name;
    private String description;

}
