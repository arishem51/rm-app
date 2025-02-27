package com.example.backend.repositories;

import com.example.backend.entities.Category;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findByNameContainingIgnoreCase(
            String name, PageRequest pageRequest);

    Page<Category> findByCreatedAtGreaterThanEqual(LocalDateTime createdAt, PageRequest pageRequest);

    Page<Category> findByNameContainingIgnoreCaseAndCreatedAtGreaterThanEqual(String name, LocalDateTime createdAt,
            PageRequest pageRequest);
}
