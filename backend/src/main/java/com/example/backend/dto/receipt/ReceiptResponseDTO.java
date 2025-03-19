package com.example.backend.dto.receipt;

import java.time.LocalDateTime;
import java.util.List;
import com.example.backend.dto.UserDTO;
import com.example.backend.entities.Receipt;
import com.example.backend.enums.ReceiptStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptResponseDTO {
    private Long id;
    private UserDTO createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ReceiptStatus status;
    private List<ReceiptItemResponseDTO> receiptItems;

    public static ReceiptResponseDTO fromEntity(Receipt receipt) {
        return ReceiptResponseDTO.builder()
                .id(receipt.getId())
                .createdBy(UserDTO.fromEntity(receipt.getCreatedBy()))
                .createdAt(receipt.getCreatedAt())
                .updatedAt(receipt.getUpdatedAt())
                .status(receipt.getStatus())
                .receiptItems(receipt.getItems().stream().map(ReceiptItemResponseDTO::fromEntity).toList())
                .build();
    }
}
