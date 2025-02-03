package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long> {
}
