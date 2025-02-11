package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    List<User> findByShopId(Long shopId);

    Page<User> findByNameContainingIgnoreCase(String search, PageRequest pageRequest);

}
