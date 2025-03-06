package com.example.backend.services;

import com.example.backend.dto.transaction.TransactionResponseDTO;
import com.example.backend.entities.Transaction;
import com.example.backend.repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    /**
     * Lấy danh sách giao dịch theo Partner ID
     */
    public List<TransactionResponseDTO> getTransactionsByPartner(Long partnerId) {
        List<Transaction> transactions = transactionRepository.findByPartnerId(partnerId);

        return transactions.stream().map(transaction -> {
            TransactionResponseDTO dto = new TransactionResponseDTO();
            dto.setId(transaction.getId());
            dto.setPartnerId(transaction.getPartner().getId());
            dto.setPartnerName(transaction.getPartner().getName());
            dto.setTransactionType(transaction.getTransactionType());
            dto.setAmount(transaction.getAmount());
            dto.setCreatedAt(transaction.getCreatedAt());
            dto.setNote(transaction.getNote());
            return dto;
        }).collect(Collectors.toList());
    }
}
