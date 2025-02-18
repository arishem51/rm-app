package com.example.backend.services;

import com.example.backend.dto.ShopDTO;
import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public Category createCategory(CreateCategoryDTO dto, User user) {
        // Lấy shop theo id từ dto


        // Kiểm tra quyền: chỉ cho phép chủ shop (hoặc admin) thêm category vào shop của mình
//        if ( user.getRole() != Role.ADMIN) {
//            throw new IllegalArgumentException("User does not have permission to add category to this shop");
//        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return categoryRepository.save(category);
    }
    public Page<Category> findCategories(int page, int pageSize, String search) {
         return search.isEmpty() ? categoryRepository.findAll(PageRequest.of(page, pageSize))
                : categoryRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));

    }
}
