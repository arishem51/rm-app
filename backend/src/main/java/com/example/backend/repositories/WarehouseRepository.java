package com.example.backend.repositories;

import com.example.backend.entities.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {


    Warehouse findByNameAndAdminId(String name, Long adminId);

    // Ví dụ: Tìm kho theo admin
    List<Warehouse> findByAdminId(Long adminId);
}
