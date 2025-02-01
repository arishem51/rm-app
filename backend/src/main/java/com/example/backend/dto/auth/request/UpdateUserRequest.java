package com.example.backend.dto.auth.request;

import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.security.validation.ValidEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Phone number must be 10-12 digits long")
    private String phoneNumber;

    @NotNull(message = "Role is required")
    @ValidEnum(enumClass = Role.class, message = "Invalid user role!")
    private String role;

    @NotNull(message = "Status is required")
    @ValidEnum(enumClass = UserStatus.class, message = "Invalid user status!")
    private String status;
}
