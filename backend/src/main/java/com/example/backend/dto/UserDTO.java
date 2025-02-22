package com.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

import com.example.backend.entities.User;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class UserDTO {
    @NotNull
    private Long id;
    @NotNull
    private String username;
    @NotNull
    private String name;
    @NotNull
    private String phoneNumber;
    @NotNull
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @NotNull
    private String role;
    @NotNull
    private String status;
    private Long shopId;
    private String shopName;
    @NotNull
    private String email;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .role(user.getRole().toString())
                .status(user.getStatus().toString())
                .shopId(user.getShop() != null ? user.getShop().getId() : null)
                .shopName(user.getShop() != null ? user.getShop().getName() : null)
                .build();
    }
}
