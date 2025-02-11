package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import com.example.backend.entities.Shop;

@Data
@Builder
public class ShopDTO {
    private Long id;
    private String name;
    private String address;
    private List<UserDTO> users;

    public static ShopDTO fromEntity(Shop shop) {
        return ShopDTO.builder()
                .id(shop.getId())
                .name(shop.getName())
                .address(shop.getAddress())
                .users(shop.getUsers().stream().map(UserDTO::fromEntity).toList())
                .build();
    }
}
