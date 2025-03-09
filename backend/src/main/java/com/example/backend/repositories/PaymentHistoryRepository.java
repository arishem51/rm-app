package com.example.backend.repositories;

import com.example.backend.entities.Order;
import com.example.backend.entities.Partner;
import com.example.backend.entities.PaymentHistory;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentHistoryRepository  extends JpaRepository<PaymentHistory, Long> {
    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.order.shop.id = :id order by ph.order.createdAt desc")
    List<PaymentHistory> findAllByShopId(long id);

}
