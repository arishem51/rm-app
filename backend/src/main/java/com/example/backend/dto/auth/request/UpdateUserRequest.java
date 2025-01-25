package com.example.backend.dto.auth.request;

import com.example.backend.enums.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private String name;
    private String phoneNumber;
    private String password;
    private Role role;
}
