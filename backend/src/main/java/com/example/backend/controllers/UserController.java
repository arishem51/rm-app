package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.auth.request.CreateUserRequest;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Operations related to users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    Logger logger = Logger.getLogger(getClass().getName());

    @Operation(summary = "Get all users", description = "Fetch a list of all registered users.")
    @GetMapping("")
    public ResponseEntity<BaseResponse<PaginateResponse<UserDTO>>> getUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {
        if (user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new BaseResponse<PaginateResponse<UserDTO>>(null, "Permission denied!"));
        }
        Page<User> users = userService.findUsers(page, pageSize, search);
        PaginateResponse<UserDTO> response = new PaginateResponse<>(users.map(UserDTO::fromEntity));
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<UserDTO>>(response, "Success!"));
    }

    @Operation(summary = "Current user", description = "Get current user by client token.")
    @GetMapping("/me")
    public ResponseEntity<BaseResponse<UserDTO>> getMe(@CurrentUser User user) {
        logger.log(Level.INFO, () -> "Get Me: " + user);
        return ResponseEntity.ok(new BaseResponse<>(UserDTO.fromEntity(user), "Success!"));
    }

    @Operation(summary = "Update a user", description = "Update a user by their name.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<UserDTO>> updateUser(@PathVariable Long id,
            @RequestBody @Valid UpdateUserRequest request, @CurrentUser User currentUser) {
        try {
            User user = userService.updateUser(id, request, currentUser);
            return ResponseEntity.ok().body(BaseResponse.success(UserDTO.fromEntity(user), "Update user success!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Create a user", description = "Create a user by owner or admin.")
    @PostMapping("")
    public ResponseEntity<BaseResponse<UserDTO>> createUser(
            @RequestBody @Valid CreateUserRequest request, @CurrentUser User currentUser) {
        try {
            User user = userService.createUser(request, currentUser);
            return ResponseEntity.ok().body(BaseResponse.success(UserDTO.fromEntity(user), "Create user success!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
