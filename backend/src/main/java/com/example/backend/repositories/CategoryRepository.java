package com.example.backend.repositories;

import com.example.backend.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;


public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findByNameContainingIgnoreCaseAndDescriptionContainingIgnoreCaseAndCreatedAtAfterAndUpdatedAtAfter(
            String name, String description, LocalDateTime createdAt, LocalDateTime updatedAt, PageRequest pageRequest);

}
