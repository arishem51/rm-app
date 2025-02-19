package com.example.backend.services;

import com.example.backend.dto.ShopDTO;
import com.example.backend.dto.category.CreateCategoryDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

//code moi
import java.util.Optional;

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

    //code moi
    @Autowired
    /**
     * Cập nhập danh mục theo ID
     * @param id ID của Category cần câp nhật
     * @param dto Đối tượng DTO chứa thông tin cần cập nhật
     * @return Danh mục sau khi đã cập nhật
     */
    public Category updateCategory(Long id, CreateCategoryDTO dto){
        //Tìm danh mục theo ID trong database
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if(optionalCategory.isPresent()){//Nếu tìm thấy danh mục
            //Lấy đối tượng Category từ Optional
            Category category = optionalCategory.get();
            category.setName(dto.getName());
            return categoryRepository.save(category);
        }else{
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    /**
     * Xoá danh mục theo ID
     * @param id ID của danh mục cần xoá
     */
    public void deleteCategory(Long id){
        if(categoryRepository.existsById(id)){
            categoryRepository.deleteById(id);
        }else{
            throw new RuntimeException("Category not found with id:"+id);
        }
    }


}