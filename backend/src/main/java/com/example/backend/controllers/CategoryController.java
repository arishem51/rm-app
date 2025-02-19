package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.ShopDTO;
import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.category.UpdateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Category Management", description = "Operations related to categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    @Operation(summary = "Get all categories", description = "Fetch a list of all registered categories.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Category>>> getCategories(@RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search) {
        Page<Category> categories = categoryService.findCategories(page, pageSize, search);
        PaginateResponse<Category> response = new PaginateResponse<>(categories);
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<Category>>(response, "Success!"));
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


    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryDTO requestDTO) {

        // Gọi service để cập nhật danh mục
        try {
            Category createdCategory = categoryService.updateCategory(id, requestDTO);
            return ResponseEntity.ok(BaseResponse.success(createdCategory, "Category update successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCategory(@PathVariable Long id){
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(BaseResponse.success(null, "Category deleted successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
