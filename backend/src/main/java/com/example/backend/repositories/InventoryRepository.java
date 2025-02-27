package com.example.backend.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findById(Long id);

    Page<Inventory> findByWarehouse_ShopId(Long shopId, Pageable pageable);

    Page<Inventory> findByWarehouse_ShopIdAndProduct_NameContainingIgnoreCase(Long shopId, String name,
            Pageable pageable);
}