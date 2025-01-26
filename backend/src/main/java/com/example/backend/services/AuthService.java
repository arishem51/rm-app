package com.example.backend.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.auth.request.SignInRequest;
import com.example.backend.dto.auth.request.SignUpRequest;
import com.example.backend.dto.auth.response.SignInResponse;
import com.example.backend.entities.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public BaseResponse<User> signUp(SignUpRequest request) {
        try {
            User user = userService.createUser(request);
            return new BaseResponse<User>(user, "Create user successfully!");
        } catch (IllegalArgumentException e) {
            return new BaseResponse<User>(null, e.getMessage());
        }
    }

    public BaseResponse<SignInResponse> signIn(SignInRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            String token = jwtService.createToken(username);
            User user = userService.findByUsername(username);
            return new BaseResponse<SignInResponse>(new SignInResponse(token, user), "Sign In successfully!");
        } catch (BadCredentialsException e) {
            return new BaseResponse<SignInResponse>(null, "Invalid username or password!");
        }
    }
}
