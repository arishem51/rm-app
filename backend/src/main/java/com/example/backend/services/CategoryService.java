package com.example.backend.services;

import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.dto.category.UpdateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.User;
import com.example.backend.enums.ActionStatus;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
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
        category.setStatus(ActionStatus.ACTIVE);
        return categoryRepository.save(category);
    }

    public Page<Category> findCategories(int page, int pageSize, String search, String createdAt) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);

        if (search.isEmpty() && (createdAt == null || createdAt.isEmpty())) {
            return categoryRepository.findAll(pageRequest);
        }

        LocalDate createdAtParsed = null;
        if (!createdAt.isEmpty()) {
            try {
                createdAtParsed = LocalDate.parse(createdAt, DateTimeFormatter.ISO_DATE);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format for createdAt.");
            }
        }

        if (createdAtParsed != null) {
            if (search.isEmpty()) {
                return categoryRepository.findByCreatedAtGreaterThanEqual(createdAtParsed.atStartOfDay(), pageRequest);
            } else {
                return categoryRepository.findByNameContainingIgnoreCaseAndCreatedAtGreaterThanEqual(search,
                        createdAtParsed.atStartOfDay(), pageRequest);
            }
        } else {
            return categoryRepository.findByNameContainingIgnoreCase(search, pageRequest);
        }
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
        if (dto.getImageUrl() != null) {
            category.setImageUrl(dto.getImageUrl());
        }
        category.setStatus(ActionStatus.valueOf(dto.getStatus()));
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

}