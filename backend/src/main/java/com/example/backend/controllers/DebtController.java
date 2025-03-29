package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.debt.*;
import com.example.backend.services.DebtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtService debtService;

    @GetMapping
    public ResponseEntity<BaseResponse<List<DebtNoteWithPartnerDTO>>> getDebtNotes(DebtNoteFilterDTO request) {

        try {
            List<DebtNoteWithPartnerDTO> dtoList = debtService.getFilteredDebtNotes(
                    request.getPartnerName(),
                    request.getMinTotalAmount(),
                    request.getMaxTotalAmount(),
                    request.getFromDate(),
                    request.getToDate()
            );
            return ResponseEntity.ok(new BaseResponse<>(dtoList, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Void>> createDebtNote(@RequestBody CreateDebtNoteDTO request) {
        try {
            debtService.createDebtNote(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(null, "Debt note created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNoteResponseDTO>> getDebtNoteById(@PathVariable Long id) {
        try {
            DebtNoteResponseDTO debtNote = debtService.getDebtNoteById(id);
            return ResponseEntity.ok(new BaseResponse<>(debtNote, "DebtNote found successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNoteResponseDTO>> updateDebtNote(@PathVariable Long id,
                                                                            @RequestBody UpdateDebtNoteDTO request) {
        try {
            debtService.updateDebtNote(id, request);
            return ResponseEntity.ok(new BaseResponse<>(null, "DebtNote updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}