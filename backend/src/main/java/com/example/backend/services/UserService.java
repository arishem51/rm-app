package com.example.backend.services;

import java.util.Optional;

import com.example.backend.enums.ActionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.auth.request.CreateUserRequest;
import com.example.backend.dto.auth.request.SignUpRequest;
import com.example.backend.dto.auth.request.UpdateUserRequest;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
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

    public User createUser(CreateUserRequest request, User currentUser) {
        if (UserRoleUtils.isStaff(currentUser)) {
            throw new IllegalArgumentException("Permission denied!");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }
        Role role = UserRoleUtils.isAdmin(currentUser) ? Role.ADMIN : Role.STAFF;
        Shop shop = null;
        if (currentUser != null) {
            shop = currentUser.getShop();
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .status(ActionStatus.ACTIVE)
                .name(request.getName())
                .shop(shop)
                .build();
        return userRepository.save(user);
    }

    public User signUpUser(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number is already taken!");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.OWNER)
                .status(ActionStatus.ACTIVE)
                .name(request.getName())
                .shop(null)
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
                throw new IllegalArgumentException("Email is already taken!");
            }
        }

        user.setName(request.getName() != null ? request.getName() : user.getName());
        user.setPhoneNumber(request.getPhoneNumber());

        // FIXME: ignore role for now

        // if (UserRoleUtils.isAdmin(currentUser)) {
        // if (!request.getRole().equals(Role.OWNER.toString())
        // && UserRoleUtils.isOwner(user)
        // && user.getShop() != null
        // && userRepository.findByShopAndRole(user.getShop(), Role.OWNER).size() == 1)
        // {
        // throw new IllegalArgumentException("This shop must have at least one owner");
        // }
        // user.setRole(request.getRole() != null ? Role.valueOf(request.getRole()) :
        // user.getRole());
        // }

        String requestUserStatus = request.getStatus();
        if (UserRoleUtils.isAdmin(currentUser)) {
            user.setStatus(ActionStatus.valueOf(requestUserStatus));
        } else if (requestUserStatus.equals(ActionStatus.INACTIVE.toString())) {
            user.setStatus(ActionStatus.INACTIVE);
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
