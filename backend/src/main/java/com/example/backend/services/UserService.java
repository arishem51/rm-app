package com.example.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.auth.request.SignUpRequest;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
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

    public User createUser(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.OWNER)
                .name(request.getName())
                .build();

        return userRepository.save(user);
    }

    public Page<User> findUsers(int page, int pageSize, String search) {
        return search.isEmpty() ? userRepository.findAll(PageRequest.of(page, pageSize))
                : userRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    public ResponseEntity<String> updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        // Update user's info
        user.setUsername(request.getName() != null ? request.getName() : user.getUsername());
        user.setPassword(request.getPassword() != null ? request.getPassword() : user.getPassword());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : user.getPhoneNumber());
        user.setRole(request.getRole() != null ? request.getRole() : user.getRole());

        // Save updated
        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully.");

    }

}
