package com.example.backend.services;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.auth.request.CreateUserRequest;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.Shop;
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

    public Page<User> findUsers(int page, int pageSize, String search) {
        return search.isEmpty() ? userRepository.findAll(PageRequest.of(page, pageSize))
                : userRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    private void validateCreateUser(CreateUserRequest request, User currentUser) {
        if (currentUser != null && Role.STAFF == currentUser.getRole()) {
            throw new IllegalArgumentException("Only Admin/Owner can create staff user");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }
    }

    public User createUser(CreateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isUserLogged = authentication.getPrincipal() instanceof User;
        User currentUser = isUserLogged ? (User) authentication.getPrincipal() : null;
        validateCreateUser(request, currentUser);
        Role role = Role.valueOf(request.getRole());
        Shop shop = null;
        if (currentUser != null) {
            shop = currentUser.getShop();
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .status(UserStatus.ACTIVE)
                .name(request.getName())
                .shop(shop)
                .build();
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request, User currentUser) {
        if (currentUser.getRole() == Role.STAFF) {
            throw new IllegalArgumentException("Permission denied!");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        if (currentUser.getRole() == Role.OWNER && !user.isEnabled()) {
            throw new UsernameNotFoundException("User not found!");
        }

        String phoneNumber = request.getPhoneNumber();
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            Optional<User> existingUser = userRepository.findByPhoneNumber(phoneNumber);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new IllegalArgumentException("Phone number is already taken!");
            }
        }
        user.setName(request.getName() != null ? request.getName() : user.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (currentUser.getRole() == Role.ADMIN) {
            user.setRole(request.getRole() != null ? Role.valueOf(request.getRole()) : user.getRole());
        }
        String requestUserStatus = request.getStatus();
        if (requestUserStatus != null) {
            if (currentUser.getRole() == Role.ADMIN) {
                user.setStatus(UserStatus.valueOf(requestUserStatus));
            } else if (requestUserStatus.equals(UserStatus.INACTIVE.toString())) {
                user.setStatus(UserStatus.INACTIVE);
            }
        }
        user.setPassword(
                request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : user.getPassword());
        userRepository.save(user);
        return user;
    }

    public User updateShop(User user, Shop shop) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (shop == null) {
            throw new IllegalArgumentException("Shop cannot be null");
        }
        user.setShop(shop);
        userRepository.save(user);
        return user;
    }
}
