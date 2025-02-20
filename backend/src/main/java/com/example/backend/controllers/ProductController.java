package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.product.CreateProductDTO;
import com.example.backend.dto.product.UpdateProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.services.ProductService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // Chỉ ADMIN và OWNER được tạo sản phẩm
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    // Chỉ ADMIN và OWNER được cập nhật sản phẩm
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody UpdateProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // Chỉ ADMIN và OWNER được xoá sản phẩm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully!");
    }

    // STAFF, ADMIN và OWNER đều có thể xem danh sách sản phẩm
    @GetMapping
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN', 'OWNER')")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // STAFF, ADMIN và OWNER có thể xem sản phẩm theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN', 'OWNER')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
