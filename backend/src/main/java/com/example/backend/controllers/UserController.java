package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Operations related to users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @Operation(summary = "Get all users", description = "Fetch a list of all registered users.")
    @GetMapping("/")
    public BaseResponse<Page<User>> getAllUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return new BaseResponse<>(userRepository.findAll(PageRequest.of(page, pageSize)), "Success!");
    }

    @Operation(summary = "Current user", description = "Get current user by client token.")
    @GetMapping("/me")
    public BaseResponse<User> getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return new BaseResponse<>(user, "Success!");
    }

    @Operation(summary = "Get a user by ID", description = "Fetch a user by their ID.")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Operation(summary = "Delete a user", description = "Delete a user by their ID.")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
