package com.example.backend.dto.auth.request;

import com.example.backend.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// FIXME: should display error message when validation fails
public class SignUpRequest extends SignInRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Phone number must be 10-12 digits long")
    private String phoneNumber;

    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "User role", example = "OWNER", allowableValues = { "USER", "ADMIN", "OWNER" })
    // FIXME: add validation for role
    private Role role;
}
