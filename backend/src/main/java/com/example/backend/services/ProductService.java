package com.example.backend.services;

import org.springframework.stereotype.Service;
import com.example.backend.dto.product.CreateProductDTO;
import com.example.backend.dto.product.UpdateProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.entities.Supplier;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public Product createProduct(CreateProductDTO dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .supplier(supplier)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, UpdateProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        product.setSupplier(supplier);

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
