package com.example.backend.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.auth.SignInRequest;
import com.example.backend.dto.auth.SignUpRequest;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public BaseResponse<User> signUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new BaseResponse<>(null, "Username is already taken!");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return new BaseResponse<>(null, "Phone number is already taken!");
        }

        User user = User.builder().username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber()).role(request.getRole()).name(request.getName()).build();

        userRepository.save(user);
        return new BaseResponse<User>(user, "Create user successfully!");
    }

    public BaseResponse<User> signIn(SignInRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        if (user.isEmpty()) {
            return new BaseResponse<>(null, "Invalid username or password!");
        }
        return new BaseResponse<User>(user.get(), "Sign In successfully!");
    }
}
