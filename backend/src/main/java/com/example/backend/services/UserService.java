package com.example.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.auth.request.CreateUserRequest;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    private void validateCreateUser(String username, String phoneNumber) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }
    }

    public Page<User> findUsers(int page, int pageSize, String search) {
        return search.isEmpty() ? userRepository.findAll(PageRequest.of(page, pageSize))
                : userRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    public User createUser(CreateUserRequest request) {
        validateCreateUser(request.getUsername(), request.getPhoneNumber());
        // FIXME: Validate just admin can create user role admin, owner can create user
        // role owner/staff
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.valueOf(request.getRole()))
                .name(request.getName())
                .build();
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("User not found!");
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()
                && userRepository.findByPhoneNumber(request.getPhoneNumber()).get().getId() != id) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }

        user.setName(request.getName() != null ? request.getName() : user.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        // FIXME: validate just admin can update role to admin
        user.setRole(request.getRole() != null ? Role.valueOf(request.getRole()) : user.getRole());
        user.setStatus(request.getStatus() != null ? UserStatus.valueOf(request.getStatus()) : user.getStatus());
        userRepository.save(user);
        return user;
    }
}
