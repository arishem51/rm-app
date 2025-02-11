package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

import com.example.backend.entities.User;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String name;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String role;
    private String status;
    private Long shopId;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .role(user.getRole().toString())
                .status(user.getStatus().toString())
                .shopId(user.getShop() != null ? user.getShop().getId() : null)
                .build();
    }
}
