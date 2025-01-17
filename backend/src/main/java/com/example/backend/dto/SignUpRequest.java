package com.example.backend.dto;

import com.example.backend.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// FIXME: should display error message when validation fails
public class SignUpRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Phone number must be 10-12 digits long")
    private String phoneNumber;

    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "User role", example = "OWNER", allowableValues = { "USER", "ADMIN", "OWNER" })
    // FIXME: add validation for role
    private Role role;
}
