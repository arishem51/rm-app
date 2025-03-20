package com.example.backend.controllers;

import com.example.backend.dto.debt.CreateDebtNoteDTO;
import com.example.backend.dto.debt.CreateDebtPaymentDTO;
import com.example.backend.dto.debt.DebtStatisticsDTO;
import com.example.backend.dto.debt.UpdateDebtNoteDTO;
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

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtService debtService;

    @GetMapping
    public ResponseEntity<List<DebtNote>> getDebtNotes(
            @RequestParam(required = false) DebtStatus status,
            @RequestParam(required = false) Long partnerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        List<DebtNote> debtNotes = debtService.getDebtNotes(status, partnerId, fromDate, toDate);
        return ResponseEntity.ok(debtNotes);
    }

    @PostMapping
    public ResponseEntity<DebtNote> createDebtNote(@RequestBody CreateDebtNoteDTO dto) {
        DebtNote debtNote = debtService.createDebtNote(dto);
        return new ResponseEntity<>(debtNote, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebtNote> getDebtNoteById(@PathVariable Long id) {
        return debtService.getDebtNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DebtNote> updateDebtNote(@PathVariable Long id, @RequestBody UpdateDebtNoteDTO dto) {
        DebtNote updatedDebtNote = debtService.updateDebtNote(id, dto);
        return ResponseEntity.ok(updatedDebtNote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebtNote(@PathVariable Long id) {
        debtService.deleteDebtNote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<List<DebtPayment>> getDebtPayments(@PathVariable Long id) {
        List<DebtPayment> payments = debtService.getDebtPayments(id);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<DebtPayment> createDebtPayment(@PathVariable Long id, @RequestBody CreateDebtPaymentDTO dto) {
        DebtPayment payment = debtService.createDebtPayment(id, dto);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping("/statistics")
    public ResponseEntity<DebtStatisticsDTO> getDebtStatistics() {
        DebtStatisticsDTO statistics = debtService.getDebtStatistics();
        return ResponseEntity.ok(statistics);
    }
} 