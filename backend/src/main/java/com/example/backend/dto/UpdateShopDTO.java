package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateShopDTO {
    private String name;
    private String address;
    private String bankAccount;
    private String bankName;
    private String postalCode;
    private String socialMedia;
    private String website;
}
