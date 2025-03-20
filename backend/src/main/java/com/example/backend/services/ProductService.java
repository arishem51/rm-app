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
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final PartnerService partnerService;
    private final CategoryService categoryService;

    private void validateUserCanManageProduct(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage products!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
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
                .description(dto.getDescription())
                .imageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : List.of())
                .build();

        return productRepository.save(product);
    }

    public Page<Product> findProducts(int page, int pageSize, String search, User currentUser) {
        if (UserRoleUtils.isAdmin(currentUser)) {
            return search.isEmpty()
                    ? productRepository.findAll(PageRequest.of(page, pageSize))
                    : productRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
        }

        Shop shop = currentUser.getShop();

        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
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
            throw new IllegalArgumentException("Product not found!");
        }
        Product product = optionalProduct.get();
        if (product.getShop().getId() != user.getShop().getId()) {
            throw new IllegalArgumentException("You can only update product from your own shop!");
        }
        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryService::findById).orElse(null);
        Partner supplier = Optional.ofNullable(dto.getSupplierId()).flatMap(partnerService::findById).orElse(null);
        product.setCategory(category);
        product.setSupplier(supplier);

        if (dto.getName() != null)
            product.setName(dto.getName());
        if (dto.getDescription() != null)
            product.setDescription(dto.getDescription());
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
}