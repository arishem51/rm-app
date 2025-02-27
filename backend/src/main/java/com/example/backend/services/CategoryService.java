package com.example.backend.services;

import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.dto.category.UpdateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.User;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.utils.UserRoleUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
//code moi
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category createCategory(CreateCategoryDTO dto, User user) {
        if (!UserRoleUtils.isAdmin(user)) {
            throw new IllegalArgumentException("Permission denied");
        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public Page<Category> findCategories(int page, int pageSize, String name, String description, String createdAt, String updatedAt) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);

        // Chuyển đổi các tham số ngày thành LocalDateTime nếu có
        LocalDateTime createdAtParsed = createdAt.isEmpty() ? null : LocalDateTime.parse(createdAt, DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime updatedAtParsed = updatedAt.isEmpty() ? null : LocalDateTime.parse(updatedAt, DateTimeFormatter.ISO_DATE_TIME);

        // Gọi phương thức repository với các tham số tìm kiếm
        return categoryRepository.findByNameContainingIgnoreCaseAndDescriptionContainingIgnoreCaseAndCreatedAtAfterAndUpdatedAtAfter(name, description, createdAtParsed, updatedAtParsed, pageRequest);
    }

    public Category updateCategory(Long id, UpdateCategoryDTO dto, User currentUser) {
        if (currentUser == null) {
            throw new IllegalArgumentException("User not found");
        }
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new IllegalArgumentException("Category not found with id: " + id);
        }

        Category category = optionalCategory.get();
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }
        if (category.getImageUrl() != null) {
            category.setImageUrl(dto.getImageUrl());
        }
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

}