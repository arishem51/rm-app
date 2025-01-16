package com.example.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.BaseResponse;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public BaseResponse<User> register(AuthRequest request) {
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
}
