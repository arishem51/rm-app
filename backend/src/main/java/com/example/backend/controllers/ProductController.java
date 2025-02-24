package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.product.ProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.services.ProductService;
import com.example.backend.services.WarehouseService;
import com.example.backend.utils.UserRoleUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "Operations related to products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final WarehouseService warehouseService;

    @Operation(summary = "Get all products", description = "Fetch a list of all registered products.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Product>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search) {
        Page<Product> products = productService.findProducts(page, pageSize, search);
        PaginateResponse<Product> response = new PaginateResponse<>(products);
        return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
    }

    @Operation(summary = "Create a product", description = "Create a new product and assign it to selected warehouse.")
    @PostMapping()
    public ResponseEntity<BaseResponse<Product>> createProduct(@RequestBody ProductDTO productDTO,
                                                               @CurrentUser User user) {
        try {
            // Kiểm tra quyền Admin
            if (UserRoleUtils.isStaff(user)) {
                throw new IllegalArgumentException("You are not authorized to create a product!");
            }

            // Tạo sản phẩm
            Product createdProduct = productService.createProduct(productDTO, user);

            // Cập nhật số lượng sản phẩm vào các kho đã chọn
            for (Long warehouseId : productDTO.getWarehouseIds()) {
                Warehouse warehouse = warehouseService.getWarehouseById(warehouseId);  // Lấy kho từ service
                if (warehouse != null) {
                    warehouse.addProduct(createdProduct);  // Thêm sản phẩm vào kho
                    warehouseService.save(warehouse);  // Lưu kho sau khi cập nhật
                }
            }

            return ResponseEntity.ok(BaseResponse.success(createdProduct, "Product created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }

    }


    @Operation(summary = "Update a product", description = "Update an existing product by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO dto,
            @CurrentUser User user) {
        try {
            Product updatedProduct = productService.updateProduct(id, dto, user);
            return ResponseEntity.ok(BaseResponse.success(updatedProduct, "Product updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
