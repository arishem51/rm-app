package com.example.backend.dto.debt;

import com.example.backend.entities.DebtNote;
import com.example.backend.entities.DebtPayment;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DebtMapper {
    
    public DebtPaymentResponseDTO toPaymentDTO(DebtPayment payment) {
        return DebtPaymentResponseDTO.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .receiptNumber(payment.getReceiptNumber())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .build();
    }
    
    public DebtNoteResponseDTO toDTO(DebtNote debtNote) {
        return DebtNoteResponseDTO.builder()
                .id(debtNote.getId())
                .partnerId(debtNote.getPartner().getId())
                .partnerName(debtNote.getPartner().getName())
                .partnerPhone(debtNote.getPartner().getPhone())
                .amount(debtNote.getAmount())
                .paidAmount(debtNote.getPaidAmount())
                .dueDate(debtNote.getDueDate())
                .createdAt(debtNote.getCreatedAt())
                .status(debtNote.getStatus())
                .source(debtNote.getSource())
                .orderId(debtNote.getOrder() != null ? debtNote.getOrder().getId() : null)
                .orderAmount(debtNote.getOrder() != null ? Double.parseDouble(String.valueOf(debtNote.getOrder().getAmount())): null)
                .description(debtNote.getDescription())
                .attachments(debtNote.getAttachments())
                .notes(debtNote.getNotes())
                .payments(debtNote.getPayments().stream()
                        .map(this::toPaymentDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}