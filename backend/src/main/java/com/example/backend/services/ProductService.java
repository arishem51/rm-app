package com.example.backend.services;

import com.example.backend.dto.product.ProductRequestDTO;
import com.example.backend.entities.Category;
import com.example.backend.entities.Product;
import com.example.backend.entities.Shop;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final PartnerService partnerService;
    private final CategoryService categoryService;

    public void validateUserCanManageProduct(User user) {
        if (!UserRoleUtils.isOwner(user) || user.getShop() == null) {
            throw new IllegalArgumentException("Bạn phải là chủ cửa hàng và có cửa hàng để quản lý sản phẩm!");
        }
    }

    public Product createProduct(ProductRequestDTO dto, User user) {
        validateUserCanManageProduct(user);
        Shop shop = user.getShop();
        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryService::findById).orElse(null);
        Partner partner = Optional.ofNullable(dto.getSupplierId()).flatMap(partnerService::findById).orElse(null);

        Product product = Product.builder()
                .name(dto.getName())
                .category(category)
                .supplier(partner)
                .shop(shop)
                .price(dto.getPrice())
                .description(dto.getDescription())
                .imageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : List.of())
                .build();

        return productRepository.save(product);
    }

    public Page<Product> findProducts(int page, int pageSize, String search, Long categoryId, User currentUser) {
        Shop shop = currentUser.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
        if (categoryId != null) {
            return productRepository.findByShopIdAndNameContainingIgnoreCaseAndCategoryId(
                    shop.getId(),
                    search,
                    categoryId,
                    PageRequest.of(page, pageSize));
        }
        return search.isEmpty()
                ? productRepository.findByShopId(currentUser.getShop().getId(), PageRequest.of(page, pageSize))
                : productRepository.findByShopIdAndNameContainingIgnoreCase(currentUser.getShop().getId(), search,
                        PageRequest.of(page, pageSize));

    }

    public List<Product> findAllProductsFromShop(User currentUser) {
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("You do not have permission to view products from this shop.");
        }
        return productRepository.findAllByShopId(currentUser.getShop().getId());
    }

    public Product updateProduct(Long id, ProductRequestDTO dto, User user) {
        validateUserCanManageProduct(user);
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm");
        }
        Product product = optionalProduct.get();
        if (product.getShop().getId() != user.getShop().getId()) {
            throw new IllegalArgumentException("Bạn chỉ có thể cập nhật sản phẩm của cửa hàng của bạn!");
        }

        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryService::findById).orElse(null);
        Partner supplier = Optional.ofNullable(dto.getSupplierId()).flatMap(partnerService::findById).orElse(null);
        String name = Optional.ofNullable(dto.getName()).orElse(product.getName());
        String description = Optional.ofNullable(dto.getDescription()).orElse(product.getDescription());
        BigDecimal price = Optional.ofNullable(dto.getPrice()).orElse(product.getPrice());

        product.setCategory(category);
        product.setSupplier(supplier);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        if (dto.getImageUrls() != null) {
            product.getImageUrls().clear();
            product.getImageUrls().addAll(dto.getImageUrls());
        }

        return productRepository.save(product);
    }

    public Product findProductById(Long id, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found!"));
        if (UserRoleUtils.isAdmin(currentUser)) {
            return product;
        }
        Shop shop = currentUser.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }

        if (product.getShop().getId() != shop.getId()) {
            throw new IllegalArgumentException("You can only view products from your own shop!");
        }
        return product;
    }

    // FIXME: block delete when it have inventory
}