package com.example.backend.dto.auth.request;

import com.example.backend.enums.Role;
import com.example.backend.security.validation.ValidEnum;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class CreateUserRequest extends SignUpRequest {
    @NotNull(message = "Role is required")
    @ValidEnum(enumClass = Role.class, message = "Invalid user role!")
    private String role;
}
