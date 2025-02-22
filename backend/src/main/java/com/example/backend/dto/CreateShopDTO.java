package com.example.backend.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateShopDTO {
    private String name;
    private String address;

    public CreateShopDTO() {}

    public CreateShopDTO(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}
