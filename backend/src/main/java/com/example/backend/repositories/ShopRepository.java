package com.example.backend.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.Shop;
import com.example.backend.entities.User;  // Import User

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findById(Long id);
    Optional<Shop> findByName(String name);
    Optional<Shop> findByAddress(String address);
    Optional<Shop> findByCreateBy(User createBy);

    boolean existsByNameAndAddress(String name, String address);
    boolean existsById(Long id);
    boolean existsByName(String name);
    boolean existsByAddress(String address);
    
    Page<Shop> findByNameContainingIgnoreCase(String search, PageRequest pageRequest);
}
