package com.example.backend.repositories;

import com.example.backend.entities.Order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

        List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

        List<Order> findTop5ByShopIdOrderByCreatedAtDesc(
                        @Param("shopId") Long shopId, Pageable pageable);;

        @Query("SELECT SUM(o.amount) FROM Order o WHERE o.createdAt >= :startOfMonth AND o.createdAt < :endOfMonth")
        BigDecimal getTotalAmountForCurrentMonth(@Param("startOfMonth") LocalDateTime startOfMonth,
                        @Param("endOfMonth") LocalDateTime endOfMonth);

        @Query("SELECT FORMAT(o.createdAt, 'yyyy-MM') AS month, " +
                        "COALESCE(SUM(o.amount), 0) AS totalRevenue " +
                        "FROM Order o " +
                        "WHERE o.shop.id = :shopId " +
                        "GROUP BY FORMAT(o.createdAt, 'yyyy-MM') " +
                        "ORDER BY month DESC")
        List<Object[]> getAmountByMonthForShop(@Param("shopId") Long shopId);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt < :endOfDay")
        Integer countOrdersForToday(@Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay);

}
