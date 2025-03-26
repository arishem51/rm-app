package com.example.backend.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entities.Inventory;

import jakarta.persistence.LockModeType;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
        Optional<Inventory> findById(Long id);

        Page<Inventory> findByProduct_ShopId(Long shopId, Pageable pageable);

        Optional<Inventory> findByZone_Id(Long zoneId);

        Page<Inventory> findByProduct_ShopIdAndProduct_NameContainingIgnoreCase(Long shopId, String name,
                        Pageable pageable);

        Optional<Inventory> findByProductId(Long id);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        Optional<Inventory> findByIdAndZoneId(Long id, Long zoneId);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        Optional<Inventory> findByZone_IdAndProduct_Id(Long zoneId, Long productId);

        Page<Inventory> findByZone_Warehouse_Shop_Id(Long shopId, Pageable pageable);

        List<Inventory> findByZone_Warehouse_Shop_Id(Long shopId);

        Page<Inventory> findByZone_Warehouse_Shop_IdAndProduct_NameContainingIgnoreCase(Long shopId,
                        String name,
                        Pageable pageable);

        @Query("SELECT i FROM Inventory i " +
                        "WHERE i.product.shop.id = :shopId " +
                        "AND (:name IS NULL OR i.product.name LIKE %:name%) " +
                        "AND (:price IS NULL OR i.product.price = :price) " +
                        "AND (:quantity IS NULL OR i.quantity = :quantity) " +
                        "AND (:warehouseId IS NULL OR i.zone.warehouse.id = :warehouseId) " +
                        "AND (:zoneId IS NULL OR i.zone.id = :zoneId) " +
                        "AND (:categoryId IS NULL OR i.product.category.id = :categoryId) " +
                        "AND (:supplierId IS NULL OR i.product.supplier.id = :supplierId)")
        Page<Inventory> findByProduct_ShopIdAndFilterConditions(
                        @Param("shopId") Long shopId,
                        @Param("name") String name,
                        @Param("price") BigDecimal price,
                        @Param("quantity") Integer quantity,
                        @Param("warehouseId") Long warehouseId,
                        @Param("zoneId") Long zoneId,
                        @Param("categoryId") Long categoryId,
                        @Param("supplierId") Long supplierId,
                        Pageable pageable);
}