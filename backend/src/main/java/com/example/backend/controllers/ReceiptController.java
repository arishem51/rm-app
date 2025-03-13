package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.entities.Receipt;
import com.example.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
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

    @Operation(summary = "Create a receipt", description = "Create a receipt by owner or staff of the shop.")
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

    @Operation(summary = "Get all receipts", description = "Fetch a list of all registered receipts.")
    @GetMapping("")
    public ResponseEntity<BaseResponse<PaginateResponse<ReceiptResponseDTO>>> getShops(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {

        try {
            Page<Receipt> item = receiptService.findReceipts(page, pageSize, search, user);
            PaginateResponse<ReceiptResponseDTO> response = new PaginateResponse<>(item.map(
                    ReceiptResponseDTO::fromEntity));
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
