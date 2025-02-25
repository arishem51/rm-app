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
        category.setImageUrl(dto.getImageUrl());
        category.setDescription(dto.getDescription());
        return categoryRepository.save(category);
    }

    public Page<Category> findCategories(int page, int pageSize, String search) {
        return search.isEmpty() ? categoryRepository.findAll(PageRequest.of(page, pageSize))
                : categoryRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));

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
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

}