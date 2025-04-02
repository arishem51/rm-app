package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByShopId(Long shopId, Pageable pageable);

    List<Product> findAllByShopId(Long shopId);

    Optional<Product> findByIdAndShopId(Long id, Long shopId);

    Page<Product> findByShopIdAndNameContainingIgnoreCase(Long shopId, String name, Pageable pageable);

    Page<Product> findByShopIdAndNameContainingIgnoreCaseAndCategoryId(
            Long shopId,
            String name,
            Long categoryId,
            Pageable pageable);

    Long countByShopId(Long shopId);
}
