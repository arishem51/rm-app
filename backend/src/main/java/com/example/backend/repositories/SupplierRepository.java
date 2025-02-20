package com.example.backend.repositories;

import com.example.backend.entities.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Page<Supplier> findByNameContainingIgnoreCase(String search, PageRequest pageRequest);
}
