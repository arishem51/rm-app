package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.category.UpdateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.User;
import com.example.backend.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Category Management", description = "Operations related to categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Get paginate categories", description = "Fetch a list of categories.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Category>>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String createdAt) {
        try {
            Page<Category> categories = categoryService.findCategories(page, pageSize, search, createdAt);
            PaginateResponse<Category> response = new PaginateResponse<>(categories);
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all categories", description = "Fetch all categories.")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(new BaseResponse<>(categories, "Success!"));
    }

    @Operation(summary = "Create a category", description = "Create a new category under a specific shop.")
    @PostMapping()
    public ResponseEntity<BaseResponse<Category>> createCategory(
            @RequestBody CreateCategoryDTO categoryDTO,
            @CurrentUser User user) {
        try {
            Category createdCategory = categoryService.createCategory(categoryDTO, user);
            return ResponseEntity.ok(BaseResponse.success(createdCategory, "Category created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a category", description = "Update an existing category by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Category>> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryDTO requestDTO,
            @CurrentUser User user) {
        try {
            // Cập nhật danh mục theo ID
            Category updatedCategory = categoryService.updateCategory(id, requestDTO, user);
            return ResponseEntity.ok(BaseResponse.success(updatedCategory, "Category updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
