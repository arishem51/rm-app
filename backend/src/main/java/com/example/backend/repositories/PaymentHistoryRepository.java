package com.example.backend.repositories;

import com.example.backend.entities.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.order.shop.id = :id order by ph.order.createdAt desc")
    List<PaymentHistory> findAllByShopId(long id);

    @Query("SELECT SUM(p.totalAmount) FROM PaymentHistory p")
    BigDecimal getTotalRevenue();

    @Query("SELECT SUM(p.totalAmount) FROM PaymentHistory p WHERE p.isDebt = true")
    BigDecimal getTotalDebt();

    @Query("SELECT FORMAT(o.createdAt, 'yyyy-MM') AS month, SUM(p.totalAmount) AS totalRevenue " +
            "FROM PaymentHistory p " +
            "JOIN p.order o " +
            "WHERE o.shop.id = :shopId " +
            "GROUP BY FORMAT(o.createdAt, 'yyyy-MM') " +
            "ORDER BY month DESC")
    List<Object[]> getRevenueByMonthForShop(@Param("shopId") Long shopId);

}
