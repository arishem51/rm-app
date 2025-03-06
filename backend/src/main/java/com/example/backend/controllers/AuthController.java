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
import com.example.backend.dto.auth.request.ForgotPasswordRequest;
import com.example.backend.dto.auth.request.ResetPasswordRequest;
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
        try {
            BaseResponse<UserDTO> response = authService.signUp(request);
            if (response.getData() == null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
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

    @Operation(summary = "Forgot password", description = "Validate email and send a code to reset password.")
    @PostMapping("/forgot-password")
    public ResponseEntity<BaseResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request);
            return ResponseEntity.ok().body(new BaseResponse<>(null, "Success!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<BaseResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok().body(new BaseResponse<>(null, "Success!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
