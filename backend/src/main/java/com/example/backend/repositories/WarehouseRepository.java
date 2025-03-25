package com.example.backend.repositories;

import com.example.backend.entities.Warehouse;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Page<Warehouse> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String search, String address,
            PageRequest pageRequest);

    Page<Warehouse> findByNameContainingIgnoreCaseAndAddressContainingIgnoreCaseAndShopId(String search,
            String address, Long shopId,
            PageRequest pageRequest);

    Page<Warehouse> findAllByShopId(Long shopId, PageRequest pageRequest);

    List<Warehouse> findAllByShopId(Long shopId);

    Optional<Warehouse> findByIdAndShopId(Long id, Long shopId);

}
