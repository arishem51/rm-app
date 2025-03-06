package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.transaction.TransactionResponseDTO;
import com.example.backend.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<BaseResponse<List<TransactionResponseDTO>>> getTransactionsByPartner(@PathVariable Long partnerId) {
        List<TransactionResponseDTO> transactions = transactionService.getTransactionsByPartner(partnerId);
        return ResponseEntity.ok(new BaseResponse<>(transactions, "Success"));
    }
}
