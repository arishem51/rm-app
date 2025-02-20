package com.example.backend.services;

import com.example.backend.dto.product.CreateProductDTO;
import com.example.backend.dto.product.UpdateProductDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Product;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;

    // Tạo sản phẩm mới
    public Product createProduct(CreateProductDTO dto, User user) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(dto.getName());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setUnit(dto.getUnit());
        product.setPurchasePrice(dto.getPurchasePrice());
        product.setSalePrice(dto.getSalePrice());
        product.setWholesalePrice(dto.getWholesalePrice());
        product.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : BigDecimal.ZERO);
        product.setLowStockAlert(dto.getLowStockAlert());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());

        return productRepository.save(product);
    }

    public Page<Product> findProducts(int page, int pageSize, String search) {
        return search.isEmpty()
                ? productRepository.findAll(PageRequest.of(page, pageSize))
                : productRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    // Cập nhật sản phẩm
    public Product updateProduct(Long id, UpdateProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (dto.getName() != null) product.setName(dto.getName()); 
        if(dto.getCategoryId()!=null){
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        if(dto.getSupplierId()!=null){
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        product.setSupplier(supplier);
    }if(dto.getUnit()!=null)product.setUnit(dto.getUnit());
        if(dto.getPurchasePrice()!=null)product.setPurchasePrice(dto.getPurchasePrice());
        if(dto.getSalePrice()!=null)product.setSalePrice(dto.getSalePrice());
        if(dto.getWholesalePrice()!=null)product.setWholesalePrice(dto.getWholesalePrice());
        if(dto.getStockQuantity()!=null)product.setStockQuantity(dto.getStockQuantity());
        if(dto.getLowStockAlert()!=null)product.setLowStockAlert(dto.getLowStockAlert());
        if(dto.getDescription()!=null)product.setDescription(dto.getDescription());
        if(dto.getImageUrl()!=null)product.setImageUrl(dto.getImageUrl());

    return productRepository.save(product);
    }

    // Xóa sản phẩm
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        product.setDeletedAt(java.time.LocalDateTime.now());
        productRepository.save(product);
    }
}