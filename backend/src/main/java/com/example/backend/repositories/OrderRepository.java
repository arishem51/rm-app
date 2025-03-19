package com.example.backend.repositories;

import com.example.backend.entities.Order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    @Query("SELECT o FROM Order o JOIN PaymentHistory p ON p.order.id = o.id WHERE o.shop.id = :shopId AND p.isDebt = false ORDER BY o.createdAt DESC")
    List<Order> findTop5OrdersByShopIdAndPaymentHistoriesIsDebtFalse(@Param("shopId") Long shopId, Pageable pageable);

}
