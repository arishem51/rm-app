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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Tạo sản phẩm mới
     * @param dto Dữ liệu đầu vào để tạo sản phẩm
     * @param user Người thực hiện thao tác
     * @return Sản phẩm sau khi tạo
     */
    public Product createProduct(CreateProductDTO dto, User user) {
        // Kiểm tra và lấy thông tin nhà cung cấp (có thể null)
        Supplier supplier = null;
        if (dto.getSupplierId() != null) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + dto.getSupplierId()));
        }

        // Kiểm tra và lấy thông tin danh mục (có thể null)
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + dto.getCategoryId()));
        }

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

    /**
     * Tìm kiếm danh sách sản phẩm với phân trang
     * @param page Trang hiện tại
     * @param pageSize Số lượng sản phẩm mỗi trang
     * @param search Từ khóa tìm kiếm theo tên
     * @return Danh sách sản phẩm theo tiêu chí tìm kiếm
     */
    public Page<Product> findProducts(int page, int pageSize, String search) {
        return search.isEmpty()
                ? productRepository.findAll(PageRequest.of(page, pageSize))
                : productRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
    }

    /**
     * Cập nhật thông tin sản phẩm
     * @param id ID của sản phẩm cần cập nhật
     * @param dto Dữ liệu cập nhật
     * @return Sản phẩm sau khi cập nhật
     */
    public Product updateProduct(Long id, UpdateProductDTO dto) {
        // Tìm sản phẩm theo ID
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();

            if (dto.getName() != null) product.setName(dto.getName());

            if (dto.getCategoryId() != null) {
                Category category = categoryRepository.findById(dto.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + dto.getCategoryId()));
                product.setCategory(category);
            }

            if (dto.getSupplierId() != null) {
                Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                        .orElseThrow(() -> new IllegalArgumentException("Supplier not found with ID: " + dto.getSupplierId()));
                product.setSupplier(supplier);
            }

            if (dto.getUnit() != null) product.setUnit(dto.getUnit());
            
            if (dto.getPurchasePrice() != null) product.setPurchasePrice(dto.getPurchasePrice());

            if (dto.getSalePrice() != null) product.setSalePrice(dto.getSalePrice());

            if (dto.getWholesalePrice() != null) product.setWholesalePrice(dto.getWholesalePrice());

            if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());

            if (dto.getLowStockAlert() != null) product.setLowStockAlert(dto.getLowStockAlert());

            if (dto.getDescription() != null) product.setDescription(dto.getDescription());
            
            if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());

            return productRepository.save(product);
        } else {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }
    }
}