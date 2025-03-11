package com.example.backend.dto.auth.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@SuperBuilder
public class SignInRequest extends AuthRequest {
    @NotBlank(message = "ReCaptchaToken is required")
    private String reCaptchaToken;
}
