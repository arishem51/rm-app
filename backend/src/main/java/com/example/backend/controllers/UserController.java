package com.example.backend.controllers;

import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Operations related to users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Operation(summary = "Get all users", description = "Fetch a list of all registered users.")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Operation(summary = "Get a user by ID", description = "Fetch a user by their ID.")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // @Operation(summary = "Create a new user", description = "Register a new user
    // with a username and password.")
    // @PostMapping
    // public User createUser(@RequestBody User user) {
    // user.setRole(Role.EMPLOYEE); // Default role
    // return userRepository.save(user);
    // }

    @Operation(summary = "Delete a user", description = "Delete a user by their ID.")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
