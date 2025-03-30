package com.example.backend.repositories;

import com.example.backend.entities.Order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);

    @Query("SELECT o FROM Order o JOIN PaymentHistory p ON p.order.id = o.id WHERE o.shop.id = :shopId AND p.isDebt = false ORDER BY o.createdAt DESC")
    List<Order> findTop5OrdersByShopIdAndPaymentHistoriesIsDebtFalse(@Param("shopId") Long shopId, Pageable pageable);

    @Query("SELECT SUM(o.amount) from Order o")
    BigDecimal getTotalAmount();

    @Query("SELECT FORMAT(o.createdAt, 'yyyy-MM') AS month, " +
            "COALESCE(SUM(o.amount), 0) AS totalRevenue " +
            "FROM Order o " +
            "WHERE o.shop.id = :shopId " +
            "GROUP BY FORMAT(o.createdAt, 'yyyy-MM') " +
            "ORDER BY month DESC")
    List<Object[]> getAmountByMonthForShop(@Param("shopId") Long shopId);

}
