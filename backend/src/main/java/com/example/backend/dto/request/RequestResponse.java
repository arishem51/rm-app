package com.example.backend.dto.request;

import com.example.backend.dto.product.ResponseProductDTO;
import com.example.backend.entities.Product;
import com.example.backend.entities.ProductCreateRequest;
import com.example.backend.repositories.CategoryRepository;
import com.example.backend.repositories.PartnerRepository;
import jdk.jshell.Snippet;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestResponse {
    private Long id;
    private String createBy;
    private String productName;
    private LocalDateTime createdAt;
    private String categoryName;
    private String supplierName;
    private String description;
    private String status;
    public static RequestResponse fromEntity(ProductCreateRequest request, CategoryRepository categoryRepository, PartnerRepository partnerRepository) {
        return RequestResponse.builder()
                .id(request.getId())
                .productName(request.getProductName())
                .description(request.getDescription())
                .categoryName(categoryRepository.findById(request.getCategoryId()).get().getName())
                .supplierName(partnerRepository.findById(request.getSupplierId()).get().getName())
                .createBy(request.getRequestedBy().getUsername())
                .createdAt(request.getCreatedAt())
                .status(request.getStatus().name())
                .build();
    }

}
