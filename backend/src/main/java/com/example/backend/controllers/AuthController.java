package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.auth.request.SignInRequest;
import com.example.backend.dto.auth.request.SignUpRequest;
import com.example.backend.dto.auth.response.SignInResponse;
import com.example.backend.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Operations related to authentication")
@Validated
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Sign up a new user", description = "Sign up a new user with a username and password.")
    @PostMapping("/sign-up")
    public ResponseEntity<BaseResponse<UserDTO>> signUp(@Valid @RequestBody SignUpRequest request) {
        BaseResponse<UserDTO> response = authService.signUp(request);
        if (response.getData() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Sign in a user", description = "Perform authentication on a user to sign in!.")
    @PostMapping("/sign-in")
    public ResponseEntity<BaseResponse<SignInResponse>> signIn(@Valid @RequestBody SignInRequest request) {
        BaseResponse<SignInResponse> response = authService.signIn(request);
        if (response.getData() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        return ResponseEntity.ok(authService.signIn(request));
    }

}
