package com.example.backend.dto.auth.request;

import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.security.validation.ValidEnum;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @Pattern(regexp = "^[0-9]{10,12}$", message = "Phone number must be 10-12 digits long")
    private String phoneNumber;

    @ValidEnum(enumClass = Role.class, message = "Invalid user role!")
    private String role;

    @ValidEnum(enumClass = UserStatus.class, message = "Invalid user status!")
    private String status;
}
