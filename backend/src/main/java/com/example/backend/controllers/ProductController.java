package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.product.RequestProductDTO;
import com.example.backend.dto.product.ResponseProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.entities.User;
import com.example.backend.services.ProductService;
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

    @Operation(summary = "Get all products", description = "Fetch a list of all registered products.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<ResponseProductDTO>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search) {
        Page<Product> products = productService.findProducts(page, pageSize, search);
        PaginateResponse<ResponseProductDTO> response = new PaginateResponse<>(
                products.map(ResponseProductDTO::fromEntity));
        return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
    }

    @Operation(summary = "Create a product", description = "Create a new product.")
    @PostMapping()
    public ResponseEntity<BaseResponse<ResponseProductDTO>> createProduct(
            @RequestBody RequestProductDTO productDTO,
            @CurrentUser User user) {
        try {
            Product createdProduct = productService.createProduct(productDTO, user);
            return ResponseEntity.ok(BaseResponse.success(ResponseProductDTO.fromEntity(createdProduct),
                    "Product created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a product", description = "Update an existing product by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ResponseProductDTO>> updateProduct(
            @PathVariable Long id,
            @RequestBody RequestProductDTO dto,
            @CurrentUser User user) {
        try {
            Product updatedProduct = productService.updateProduct(id, dto, user);
            return ResponseEntity.ok(BaseResponse.success(ResponseProductDTO.fromEntity(updatedProduct),
                    "Product updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
