package com.example.backend.dto.receipt;

import lombok.*;
import com.example.backend.entities.Receipt;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseReceiptDTO {

    private Long id; 
    private String shopName;
    private String partnerName;
    private String createdBy;
    private List<String> products;
    private double totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ResponseReceiptDTO fromEntity(Receipt receipt) {
        return ResponseReceiptDTO.builder()
                .id(receipt.getId()) 
                .shopName(receipt.getShop().getName())
                .partnerName(receipt.getPartner() != null ? receipt.getPartner().getName() : receipt.getPartnerName()) 
                .createdBy(receipt.getCreatedBy().getUsername())
                .products(receipt.getProducts())
                .totalAmount(receipt.getTotalAmount())
                .createdAt(receipt.getCreatedAt()) 
                .updatedAt(receipt.getUpdatedAt())
                .build();
    }
}
