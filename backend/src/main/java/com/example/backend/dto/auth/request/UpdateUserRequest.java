package com.example.backend.dto.auth.request;

import com.example.backend.enums.ActionStatus;
import com.example.backend.enums.Role;
import com.example.backend.security.validation.ValidEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    @Size(min = 2, max = 16, message = "Password must be at least 2 to 16 characters long")
    private String name;
    @Size(min = 6, max = 12, message = "Password must be at least 6 to 12 characters long")
    private String password;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits long")
    private String phoneNumber;

    @ValidEnum(enumClass = Role.class, message = "Invalid user role!")
    private String role;

    @ValidEnum(enumClass = ActionStatus.class, message = "Invalid user status!")
    private String status;

    @Email(message = "Email should be valid")
    private String email;
}
