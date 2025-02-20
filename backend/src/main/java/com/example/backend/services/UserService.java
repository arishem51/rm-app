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
import com.example.backend.utils.UserRoleUtils;
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
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken!");
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
                .email(request.getEmail())
                .build();
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request, User currentUser) {
        if (UserRoleUtils.isStaff(currentUser)) {
            throw new IllegalArgumentException("Permission denied!");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));

        if (UserRoleUtils.isOwner(currentUser) && !user.isEnabled()) {
            throw new UsernameNotFoundException("User not found!");
        }

        // FIXME: Refactor this
        String phoneNumber = request.getPhoneNumber();
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            Optional<User> existingUser = userRepository.findByPhoneNumber(phoneNumber);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new IllegalArgumentException("Phone number is already taken!");
            }
        }
        String email = request.getEmail();
        if (email != null && !email.isEmpty()) {
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new IllegalArgumentException("email is already taken!");
            }
        }

        user.setName(request.getName() != null ? request.getName() : user.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (UserRoleUtils.isAdmin(currentUser)) {
            user.setRole(request.getRole() != null ? Role.valueOf(request.getRole()) : user.getRole());
        }
        String requestUserStatus = request.getStatus();
        if (UserRoleUtils.isAdmin(currentUser)) {
            user.setStatus(UserStatus.valueOf(requestUserStatus));
        } else if (requestUserStatus.equals(UserStatus.INACTIVE.toString())) {
            user.setStatus(UserStatus.INACTIVE);
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

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public void resetPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
