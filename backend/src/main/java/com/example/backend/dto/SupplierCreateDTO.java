package com.example.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SupplierCreateDTO {
    private String name;
    private String contractName;
    private String phone;
    private String email;
    private String taxId;
    private String address;
    private String website;
    private int totalDebt;
    private LocalDateTime lastOrderDate;
    private String notes;
}
