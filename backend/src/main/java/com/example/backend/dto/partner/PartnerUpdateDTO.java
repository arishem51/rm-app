package com.example.backend.dto.partner;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PartnerUpdateDTO {
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private String website;
    private String description;
}
