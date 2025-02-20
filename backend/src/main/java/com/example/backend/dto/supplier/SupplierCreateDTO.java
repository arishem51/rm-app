package com.example.backend.dto.supplier;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierCreateDTO {

    @NotEmpty(message = "Supplier name is required")
    private String name;

    @NotEmpty(message = "Contact name is required")
    private String contactName;

    @NotEmpty(message = "Phone number is required")
    @Pattern(regexp = "^(\\+?\\d{1,3})?\\d{10}$", message = "Invalid phone number format")
    private String phone;

    @NotEmpty(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty(message = "Tax ID is required")
    private String taxId;

    @NotEmpty(message = "Address is required")
    private String address;

    private String website;
    private String notes;
}
