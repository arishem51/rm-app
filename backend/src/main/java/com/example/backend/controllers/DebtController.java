package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.debt.*;
import com.example.backend.entities.DebtNote;
import com.example.backend.entities.DebtPayment;
import com.example.backend.enums.DebtStatus;
import com.example.backend.services.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtService debtService;

    @Autowired
    private DebtMapper debtMapper;

    @GetMapping
    public ResponseEntity<BaseResponse<List<DebtNoteResponseDTO>>> getDebtNotes(
            @RequestParam(required = false) DebtStatus status,
            @RequestParam(required = false) Long partnerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        try {
            List<DebtNote> debtNotes = debtService.getDebtNotes(status, partnerId, fromDate, toDate);
            List<DebtNoteResponseDTO> dtoList = debtNotes.stream()
                    .map(debtMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new BaseResponse<>(dtoList, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<DebtNoteResponseDTO>> createDebtNote(@RequestBody CreateDebtNoteDTO dto) {
        try {
            DebtNote debtNote = debtService.createDebtNote(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(debtMapper.toDTO(debtNote), "Debt note created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNoteResponseDTO>> getDebtNoteById(@PathVariable Long id) {
        return debtService.getDebtNoteById(id)
                .map(debtNote -> ResponseEntity.ok(new BaseResponse<>(debtMapper.toDTO(debtNote), "Success!")))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNoteResponseDTO>> updateDebtNote(
            @PathVariable Long id,
            @RequestBody UpdateDebtNoteDTO dto) {
        try {
            DebtNote updatedDebtNote = debtService.updateDebtNote(id, dto);
            return ResponseEntity.ok(new BaseResponse<>(debtMapper.toDTO(updatedDebtNote), "Debt note updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteDebtNote(@PathVariable Long id) {
        try {
            debtService.deleteDebtNote(id);
            return ResponseEntity.ok(new BaseResponse<>(null, "Debt note deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<BaseResponse<List<DebtPaymentResponseDTO>>> getDebtPayments(@PathVariable Long id) {
        List<DebtPayment> payments = debtService.getDebtPayments(id);
        List<DebtPaymentResponseDTO> dtoList = payments.stream()
                .map(debtMapper::toPaymentDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new BaseResponse<>(dtoList, "Success!"));
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<BaseResponse<DebtPaymentResponseDTO>> createDebtPayment(
            @PathVariable Long id,
            @RequestBody CreateDebtPaymentDTO dto) {
        try {
            DebtPayment payment = debtService.createDebtPayment(id, dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(debtMapper.toPaymentDTO(payment), "Payment created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<BaseResponse<DebtStatisticsDTO>> getDebtStatistics() {
        DebtStatisticsDTO statistics = debtService.getDebtStatistics();
        return ResponseEntity.ok(new BaseResponse<>(statistics, "Success!"));
    }
}