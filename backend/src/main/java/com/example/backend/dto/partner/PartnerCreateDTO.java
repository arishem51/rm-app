package com.example.backend.dto.partner;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PartnerCreateDTO {
    @NotEmpty(message = "Partner name is required")
    private String name;

    @NotEmpty(message = "Contact name is required")
    private String contactName;

    @NotEmpty(message = "Phone number is required")
    @Pattern(regexp = "^(\\+?\\d{1,3})?\\d{10}$", message = "Invalid phone number format")
    private String phone;

    @NotEmpty(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty(message = "Address is required")
    private String address;

    private String website;
    private String description;
    private boolean canHaveDebt;
}
