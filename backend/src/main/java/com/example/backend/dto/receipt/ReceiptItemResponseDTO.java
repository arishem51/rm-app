package com.example.backend.dto.receipt;

import com.example.backend.entities.ReceiptItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemResponseDTO {

    private Long id;
    private Long receiptId;
    private Long productId;
    private String productName;
    private Double productPrice;
    private Integer quantity;
    private Long zoneId;
    private String zoneName;

    public static ReceiptItemResponseDTO fromEntity(ReceiptItem receiptItem) {
        return ReceiptItemResponseDTO.builder()
                .id(receiptItem.getId())
                .receiptId(receiptItem.getReceipt().getId())
                .productId(receiptItem.getProductId())
                .productName(receiptItem.getProductName())
                .productPrice(receiptItem.getProductPrice().doubleValue())
                .quantity(receiptItem.getQuantity())
                .zoneId(receiptItem.getZoneId())
                .zoneName(receiptItem.getZoneName())
                .build();
    }

}
