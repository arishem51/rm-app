package com.example.backend.services;

import com.example.backend.dto.product.RequestProductDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Product;
import com.example.backend.entities.Shop;
import com.example.backend.entities.Supplier;
import com.example.backend.entities.User;
import com.example.backend.enums.UnitType;
import com.example.backend.repositories.ProductRepository;
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
    private final SupplierService supplierService;
    private final CategoryService categoryService;

    private void validateUserCanManageProduct(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage products!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
    }

    public Product createProduct(RequestProductDTO dto, User user) {
        validateUserCanManageProduct(user);

        Shop shop = user.getShop();
        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryService::findById).orElse(null);
        Supplier supplier = Optional.ofNullable(dto.getSupplierId()).flatMap(supplierService::findById).orElse(null);

        Product product = Product.builder()
                .name(dto.getName())
                .category(category)
                .supplier(supplier)
                .shop(shop)
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

    public Product updateProduct(Long id, RequestProductDTO dto, User user) {
        validateUserCanManageProduct(user);
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isEmpty()) {
            throw new IllegalArgumentException("Product not found!");
        }

        Product product = optionalProduct.get();
        if (product.getShop().getId() != user.getShop().getId()) {
            throw new IllegalArgumentException("You can only update products from your own shop!");
        }
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
    }
}