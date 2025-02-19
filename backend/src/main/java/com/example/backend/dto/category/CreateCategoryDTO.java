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

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

}
