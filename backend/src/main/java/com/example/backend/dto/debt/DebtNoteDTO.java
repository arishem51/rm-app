//package com.example.backend.dto.debt;
//
//import com.example.backend.entities.DebtNote;
//import com.example.backend.entities.Partner;
//import com.example.backend.enums.DebtStatus;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class DebtNoteDTO {
//    private Long id;
//    private Partner partner;
//    private Double totalAmount;
//    private LocalDate dueDate;
//    private DebtStatus status;
//    private String source;
//    private Double paidAmount;
//    private Double remainingAmount;
//    private LocalDateTime createdAt;
//
//
//    public static DebtNoteDTO convertToDTO(DebtNote debtNote) {
//        return DebtNoteDTO.builder()
//                .id(debtNote.getId())
//                .partner(debtNote.getPartner())
//                .status(debtNote.getStatus())
//                .totalAmount(debtNote.getAmount())
//                .paidAmount(debtNote.getPaidAmount())
//                .remainingAmount(debtNote.getPaidAmount())
//                .dueDate(debtNote.getDueDate())
//                .createdAt(debtNote.getCreatedAt())
//                .source(debtNote.getSource())
//                .build();
//    }
//}
//
//
//
