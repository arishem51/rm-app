package com.example.backend.dto;

import com.example.backend.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String phoneNumber;
    private String name;

    @Schema(description = "User role", example = "OWNER", allowableValues = { "USER", "ADMIN", "OWNER" })
    private Role role;
}
