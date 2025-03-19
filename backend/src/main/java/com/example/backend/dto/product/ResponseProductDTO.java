package com.example.backend.dto.product;

import java.math.BigDecimal;
import java.util.List;
import com.example.backend.entities.Category;
import com.example.backend.entities.Partner;
import com.example.backend.entities.Product;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResponseProductDTO {
    private Long id;
    private String name;
    private String description;
    private Category category;
    private Partner supplier;

    private Long shopId;
    private String shopName;
    private BigDecimal price;
    private List<String> imageUrls;

    public static ResponseProductDTO fromEntity(Product product) {
        return ResponseProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory())
                .supplier(product.getSupplier())
                .shopId(product.getShop().getId())
                .shopName(product.getShop().getName())
                .imageUrls(product.getImageUrls())
                .build();
    }

}
