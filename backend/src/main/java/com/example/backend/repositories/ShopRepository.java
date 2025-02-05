package com.example.backend.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;


import com.example.backend.entities.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findById(Long id);
    Optional<Shop> findByName(String name);
    Optional<Shop> findByAdress(String address);
    Optional<Shop> findBycreateBy(String createBy);

    boolean existsById(Long id);
    boolean existsByUsername(String name);
    boolean existsByAddress(String address);
    
    Page<Shop> findByNameContainingIgnoreCase(String search, PageRequest pageRequest);
    
}
