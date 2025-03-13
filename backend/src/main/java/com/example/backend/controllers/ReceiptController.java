package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.entities.Receipt;
import com.example.backend.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.receipt.ReceiptCreateDTO;
import com.example.backend.dto.receipt.ReceiptResponseDTO;
import com.example.backend.services.ReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/receipts")
@Tag(name = "Receipt Controller", description = "Operations related to receipt")
@RequiredArgsConstructor
public class ReceiptController {
    private final ReceiptService receiptService;

    @Operation(summary = "Create a zone", description = "Create a zone by owner or staff of the shop.")
    @PostMapping("")
    public ResponseEntity<BaseResponse<ReceiptResponseDTO>> createReceipt(@RequestBody ReceiptCreateDTO dto,
            @CurrentUser User user) {
        try {
            Receipt item = receiptService.create(dto, user);
            return ResponseEntity.ok()
                    .body(BaseResponse.success(ReceiptResponseDTO.fromEntity(item), "Create success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
