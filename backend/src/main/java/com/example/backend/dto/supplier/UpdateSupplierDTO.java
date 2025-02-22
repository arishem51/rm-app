package com.example.backend.dto.supplier;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSupplierDTO {
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String taxCode;
    private String address;
    private String website;
    private String description;
}
