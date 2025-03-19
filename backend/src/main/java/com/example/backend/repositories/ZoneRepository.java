package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.entities.Zone;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByWarehouse_ShopId(Long shopId);

    List<Zone> findByWarehouseIdAndWarehouse_ShopId(Long warehouseId, Long shopId);

    Optional<Zone> findByIdAndWarehouse_ShopId(Long id, Long shopId);

    int countByWarehouse_Id(Long warehouseId);

    @Query("SELECT z.warehouse.id, COUNT(z) FROM Zone z GROUP BY z.warehouse.id")
    List<Object[]> countZonesByWarehouse();
}
