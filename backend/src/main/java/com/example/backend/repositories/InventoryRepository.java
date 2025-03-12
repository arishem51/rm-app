package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findById(Long id);

    Page<Inventory> findByZone_Warehouse_Shop_Id(Long shopId, Pageable pageable);

    List<Inventory> findByZone_Warehouse_Shop_Id(Long shopId);

    Page<Inventory> findByZone_Warehouse_Shop_IdAndProduct_NameContainingIgnoreCase(Long shopId,
            String name,
            Pageable pageable);
}