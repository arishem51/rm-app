package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import com.example.backend.entities.Inventory;
import jakarta.persistence.LockModeType;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Inventory> findByIdAndZoneId(Long id, Long zoneId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Inventory> findByZone_Id(Long zoneId);

    Page<Inventory> findByZone_Warehouse_Shop_Id(Long shopId, Pageable pageable);

    List<Inventory> findByZone_Warehouse_Shop_Id(Long shopId);

    Page<Inventory> findByZone_Warehouse_Shop_IdAndProduct_NameContainingIgnoreCase(Long shopId,
            String name,
            Pageable pageable);

    Optional<Inventory> findByProduct_IdAndZone_Warehouse_Shop_Id(Long productId, Long shopId);
}