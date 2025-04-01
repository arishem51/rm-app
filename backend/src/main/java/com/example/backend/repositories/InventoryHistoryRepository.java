package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.InventoryHistory;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {
}