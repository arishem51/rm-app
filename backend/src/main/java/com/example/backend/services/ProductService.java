package com.example.backend.services;

import com.example.backend.dto.product.ProductRequestDTO;
import com.example.backend.dto.request.RequestResponse;
import com.example.backend.entities.Category;
import com.example.backend.entities.Product;
import com.example.backend.entities.ProductCreateRequest;
import com.example.backend.entities.Shop;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.enums.RequestStatus;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.repositories.PartnerRepository;
import com.example.backend.repositories.ProductCreateRequestRepository;
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
    private final ProductCreateRequestRepository productCreateRequestRepository;
    private final PartnerService partnerService;
    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    private  final PartnerRepository partnerRepository;
    private void validateUserCanManageProduct(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage products!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
    }

    public void createProduct(ProductRequestDTO dto, User user) {
        if (UserRoleUtils.isStaff(user)) {
            ProductCreateRequest request = ProductCreateRequest.builder()
                    .shop(user.getShop())
                    .requestedBy(user)
                    .productName(dto.getName())
                    .description(dto.getDescription())
                    .categoryId(dto.getCategoryId())
                    .supplierId(dto.getSupplierId())
                    .status(RequestStatus.PENDING)
                    .build();
            productCreateRequestRepository.save(request);
            throw new IllegalArgumentException("Request sent to Owner for approval.");
        }

        validateUserCanManageProduct(user);
        Shop shop = user.getShop();
        Category category = Optional.ofNullable(dto.getCategoryId()).flatMap(categoryService::findById).orElse(null);
        Partner supplier = Optional.ofNullable(dto.getSupplierId()).flatMap(partnerService::findById).orElse(null);

        Product product = Product.builder()
                .name(dto.getName())
                .category(category)
                .supplier(supplier)
                .shop(shop)
                .description(dto.getDescription())
                .imageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : List.of())
                .build();

        productRepository.save(product);
    }

    public Product approveProductRequest(Long requestId, boolean isApproved, User owner) {
        if (!UserRoleUtils.isOwner(owner)) {
            throw new IllegalArgumentException("Only the shop owner can approve product requests!");
        }

        ProductCreateRequest request = productCreateRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Product request not found!"));

        if (!request.getShop().getId().equals(owner.getShop().getId())) {
            throw new IllegalArgumentException("You can only approve requests from your own shop!");
        }

        if (!isApproved) {
            request.setStatus(RequestStatus.REJECTED);
            productCreateRequestRepository.save(request);
            return null;
        }

        Product product = Product.builder()
                .name(request.getProductName())
                .description(request.getDescription())
                .category(categoryService.findById(request.getCategoryId()).orElse(null))
                .supplier(partnerService.findById(request.getSupplierId()).orElse(null))
                .shop(request.getShop())
                .build();

        productRepository.save(product);
        request.setStatus(RequestStatus.APPROVED);
        productCreateRequestRepository.save(request);
        return product;
    }

    public List<RequestResponse> getPendingRequests(User owner) {
        List<ProductCreateRequest>list = productCreateRequestRepository.findByShopIdOrderByCreatedAtDesc(owner.getShop().getId());
        return list.stream().map(request -> {
            new RequestResponse();
            return RequestResponse.fromEntity(request, categoryRepository, partnerRepository);
        }).toList();
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