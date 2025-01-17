package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.SignUpRequest;
import com.example.backend.dto.BaseResponse;
import com.example.backend.entities.User;
import com.example.backend.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Operations related to authentication")
@Validated
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new user", description = "Register a new user with a username and password.")
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<User>> register(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

}
