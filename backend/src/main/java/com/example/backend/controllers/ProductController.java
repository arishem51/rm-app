package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.product.ProductRequestDTO;
import com.example.backend.dto.product.ResponseProductDTO;
import com.example.backend.dto.request.RequestResponse;
import com.example.backend.entities.Product;
import com.example.backend.entities.ProductCreateRequest;
import com.example.backend.entities.User;
import com.example.backend.services.ProductService;
import com.example.backend.utils.UserRoleUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "Operations related to products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @Operation(summary = "Get page products", description = "Fetch a list of page registered products.")
    @GetMapping("")
    public ResponseEntity<BaseResponse<PaginateResponse<ResponseProductDTO>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {
        try {
            Page<Product> products = productService.findProducts(page, pageSize, search, user);
            PaginateResponse<ResponseProductDTO> response = new PaginateResponse<>(
                    products.map(ResponseProductDTO::fromEntity));
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all products", description = "Fetch a list of page registered products of a shop.")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<ResponseProductDTO>>> getAllProducts(
            @CurrentUser User user) {
        try {
            List<Product> products = productService.findAllProductsFromShop(user);
            List<ResponseProductDTO> response = products.stream().map(ResponseProductDTO::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get a product", description = "Fetch a product by ID.")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<ResponseProductDTO>> getProduct(@PathVariable Long id,
            @CurrentUser User currentUser) {
        try {
            Product product = productService.findProductById(id, currentUser);
            return ResponseEntity.ok(BaseResponse.success(ResponseProductDTO.fromEntity(product), "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Create a product", description = "Create a new product")
    @PostMapping("")
    public ResponseEntity<BaseResponse<String>> createProduct(
            @RequestBody ProductRequestDTO productDTO,
            @CurrentUser User user) {
        try {
            productService.createProduct(productDTO, user);
            return ResponseEntity.ok(BaseResponse.success("Request sent to Owner for approval!", "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all pending product requests", description = "Fetch a list of all pending product requests.")
    @GetMapping("/requests")
    public ResponseEntity<BaseResponse<List<RequestResponse>>> getProductRequests(@CurrentUser User owner) {
        try {
            List<RequestResponse> requests = productService.getPendingRequests(owner);
            return ResponseEntity.ok(new BaseResponse<>(requests, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Approve or reject a product request", description = "Approve or reject a product request.")
    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<BaseResponse<String>> approveProductRequest(
            @PathVariable Long id,
            @RequestParam boolean approve,
            @CurrentUser User owner) {
        try {
            Product product = productService.approveProductRequest(id, approve, owner);
            return ResponseEntity.ok(new BaseResponse<>(
                approve ? "Product approved and created successfully!" : "Product request rejected.",
                "Success!"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a product", description = "Update an existing product by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ResponseProductDTO>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO dto,
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
