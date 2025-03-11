package com.example.backend.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.backend.controllers.ReCaptchaToken;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.auth.request.ForgotPasswordRequest;
import com.example.backend.dto.auth.request.ResetPasswordRequest;
import com.example.backend.dto.auth.request.SignInRequest;
import com.example.backend.dto.auth.request.SignUpRequest;
import com.example.backend.dto.auth.response.SignInResponse;
import com.example.backend.entities.PasswordResetToken;
import com.example.backend.entities.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final EmailService emailService;
    private final ReCaptchaToken reCaptchaTokenService;

    public BaseResponse<UserDTO> signUp(SignUpRequest request) {
        try {
            User user = userService.signUpUser(request);
            return new BaseResponse<>(UserDTO.fromEntity(user), "Create user successfully!");
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public BaseResponse<SignInResponse> signIn(SignInRequest request) {
        try {
            String reCaptchaToken = request.getReCaptchaToken();
            boolean success = reCaptchaTokenService.verifyToken(reCaptchaToken);
            if (success) {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                String username = userDetails.getUsername();
                String token = jwtService.createToken(username);
                User user = userService.findByUsername(username);
                return new BaseResponse<>(new SignInResponse(token, UserDTO.fromEntity(user)),
                        "Sign In successfully!");
            } else {
                throw new IllegalArgumentException("ReCaptcha verification failed!");
            }

        } catch (BadCredentialsException e) {
            return new BaseResponse<>(null, "Invalid username or password!");
        } catch (DisabledException e) {
            return new BaseResponse<>(null, "User is disabled!");
        }
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        try {
            String reCaptchaToken = request.getReCaptchaToken();
            boolean success = reCaptchaTokenService.verifyToken(reCaptchaToken);
            if (success) {
                String email = request.getEmail();
                userService.findByEmail(email);
                String token = passwordResetTokenService.createToken(email);
                String resetLink = "http://localhost:3000/auth/reset-password?token=" + token;
                emailService.sendResetEmail(email, resetLink);
            } else {
                throw new IllegalArgumentException("ReCaptcha verification failed!");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        try {
            PasswordResetToken passwordResetToken = passwordResetTokenService.verify(request.getToken());
            String email = passwordResetToken.getEmail();
            User user = userService.findByEmail(email);
            userService.resetPassword(user, request.getPassword());
            passwordResetTokenService.deleteToken(email);
        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}
