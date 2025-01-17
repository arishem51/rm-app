package com.example.backend.dto.auth.response;

import com.example.backend.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SignInResponse {
    private String token;
    private User user;
}
