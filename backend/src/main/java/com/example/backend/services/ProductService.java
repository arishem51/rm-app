package com.example.backend.services;

import com.example.backend.dto.product.CreateProductDTO;
import com.example.backend.dto.product.UpdateProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public Product createProduct(CreateProductDTO dto, User user) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = new Product();
                product.setName(dto.getName());
                product.setDescription(dto.getDescription());
                product.setSupplier(supplier);
        return productRepository.save(product);
    }

    public Page<Product> findProducts(int page, int pageSize, String search) {
        return search.isEmpty()
                ? productRepository.findAll(PageRequest.of(page, pageSize))
                : productRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    public Product updateProduct(Long id, UpdateProductDTO dto) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        
        if(optionalProduct.isPresent()){//Neu tim thay san pham
            Product product = optionalProduct.get();
            if (dto.getName() != null){
                product.setName(dto.getName());
            }
            if (dto.getDescription() != null){
                product.setDescription(dto.getDescription());
            }
            return productRepository.save(product);
        }else{
            throw new RuntimeException("Product not found with id: "+id);

        }

    }
    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        
        if(optionalProduct.isPresent()){//Neu tim thay san pham
            productRepository.delete(optionalProduct.get());
    }else{
        throw new IllegalArgumentException("Category not found with id: "+id);
    }

    }
}