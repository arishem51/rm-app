package com.example.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.InventoryHistory;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {

    Page<InventoryHistory> findByInventoryIdAndZone_Warehouse_Shop_Id(Long inventoryId, Long shopId, Pageable pageable);
}