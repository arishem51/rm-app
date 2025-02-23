package com.example.backend.services;

import com.example.backend.dto.product.ProductDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Product;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.enums.UnitType;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.SupplierRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;

    public Product createProduct(ProductDTO dto, User user) {
        if (UserRoleUtils.isStaff(user)) {
            throw new IllegalArgumentException("You are not authorized to create a product!");
        }
        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryRepository::findById).orElse(null);
        Supplier supplier = Optional.ofNullable(dto.getSupplierId()).flatMap(supplierRepository::findById).orElse(null);

        Product product = Product.builder()
                .name(dto.getName())
                .category(category)
                .supplier(supplier)
                .unit(UnitType.valueOf(dto
                        .getUnit().toUpperCase()))
                .salePrice(dto.getSalePrice())
                .wholesalePrice(dto.getWholesalePrice())
                .description(dto.getDescription())
                .imageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : List.of())
                .build();

        return productRepository.save(product);
    }

    public Page<Product> findProducts(int page, int pageSize, String search) {
        return search.isEmpty()
                ? productRepository.findAll(PageRequest.of(page, pageSize))
                : productRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    public Product updateProduct(Long id, ProductDTO dto, User user) {
        if (UserRoleUtils.isStaff(user)) {
            throw new IllegalArgumentException("You are not authorized to update a product!");
        }
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if (dto.getName() != null)
                product.setName(dto.getName());

            if (dto.getUnit() != null)
                product.setUnit(UnitType.valueOf(dto.getUnit().toUpperCase()));
            if (dto.getSalePrice() != null)
                product.setSalePrice(dto.getSalePrice());
            if (dto.getWholesalePrice() != null)
                product.setWholesalePrice(dto.getWholesalePrice());
            if (dto.getDescription() != null)
                product.setDescription(dto.getDescription());
            if (dto.getImageUrls() != null) {
                product.getImageUrls().clear();
                product.getImageUrls().addAll(dto.getImageUrls());
            }

            return productRepository.save(product);
        } else {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }
    }
}