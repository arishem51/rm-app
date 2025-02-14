package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import java.util.Collections;

import com.example.backend.entities.Shop;

@Data
@Builder
public class ShopDTO {
    private Long id;
    private String name;
    private String address;
    private List<UserDTO> users;
    private UserDTO createdBy;

    public static ShopDTO fromEntity(Shop shop) {
        if (shop == null) {
            return null;
        }

        return ShopDTO.builder()
                .id(shop.getId())
                .name(shop.getName())
                .address(shop.getAddress())
                .users(shop.getUsers() != null
                        ? shop.getUsers().stream().map(UserDTO::fromEntity).toList()
                        : Collections.emptyList()) // Tránh lỗi null
                .createdBy(shop.getCreateBy() != null
                        ? UserDTO.fromEntity(shop.getCreateBy())
                        : null) // Tránh lỗi null
                .build();
    }
}
