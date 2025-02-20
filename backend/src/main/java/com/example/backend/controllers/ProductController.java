package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.product.CreateProductDTO;
import com.example.backend.dto.product.UpdateProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.services.ProductService;
import com.example.backend.entities.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "Operations related to products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // Lấy danh sách sản phẩm có phân trang & tìm kiếm
    @Operation(summary = "Get all products", description = "Fetch a list of all registerd products.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Product>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search) {
        try {
            Page<Product> product = productService.findProducts(page, pageSize, search);
            PaginateResponse<Product> response = new PaginateResponse<>(product);
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse<PaginateResponse<Product>>(null, "Failed to fetch products"));
        }
    }

    // Chỉ ADMIN và OWNER được tạo sản phẩm
    @Operation(summary = "Create a product", description = "Create a product by admin or owner.")
    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<BaseResponse<Product>> createProduct(@RequestBody CreateProductDTO productDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            Product product = productService.createProduct(productDTO, user);
            return ResponseEntity.ok(BaseResponse.success(product, "Product created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponse<>(null, "Failed to create product!"));
        }
    }

    // Chỉ ADMIN và OWNER được cập nhật sản phẩm
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<BaseResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductDTO dto) {
        try {
            Product product = productService.updateProduct(id, dto);
            return ResponseEntity.ok(new BaseResponse<>(product, "Product updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponse<>(null, "Failed to update product!"));
        }
    }

    // Chỉ ADMIN và OWNER được xoá sản phẩm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<BaseResponse<Void>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new BaseResponse<>(null, "Product deleted successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new BaseResponse<>(null, "Failed to delete product!"));
        }
    }

}
