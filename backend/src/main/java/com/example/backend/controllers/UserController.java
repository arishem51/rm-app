package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.User;
import com.example.backend.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Operations related to users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "Get all users", description = "Fetch a list of all registered users.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<User>>> getUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search) {
        Page<User> users = userService.findUsers(page, pageSize, search);
        PaginateResponse<User> response = new PaginateResponse<>(users);
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<User>>(response, "Success!"));
    }

    @Operation(summary = "Current user", description = "Get current user by client token.")
    @GetMapping("/me")
    public ResponseEntity<BaseResponse<User>> getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new BaseResponse<>(user, "Success!"));
    }

    @Operation(summary = "Update a user", description = "Update a user by their name.")
    @PutMapping("/{id}")
    public void updateUser(@PathVariable String username, @RequestBody UpdateUserRequest request) {

    }

}
