package com.example.backend.repositories;

import com.example.backend.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);
}
