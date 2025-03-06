package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.debtnote.DebtNoteCreateDTO;
import com.example.backend.dto.debtnote.DebtNoteUpdateDTO;
import com.example.backend.entities.DebtNote;
import com.example.backend.entities.User;
import com.example.backend.services.DebtNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debt-notes")
@RequiredArgsConstructor
public class DebtNoteController {
    private final DebtNoteService debtNoteService;

    /**
     * Lấy danh sách tất cả phiếu nợ
     */
    @GetMapping
    public ResponseEntity<BaseResponse<List<DebtNote>>> getAllDebtNotes() {
        List<DebtNote> debtNotes = debtNoteService.getAllDebtNotes();
        return ResponseEntity.ok(new BaseResponse<>(debtNotes, "Success"));
    }

    /**
     * Lấy phiếu nợ theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNote>> getDebtNoteById(@PathVariable Long id) {
        DebtNote debtNote = debtNoteService.getDebtNoteById(id);
        return ResponseEntity.ok(new BaseResponse<>(debtNote, "Success"));
    }

    /**
     * Tạo phiếu nợ mới
     */
    @PostMapping
    public ResponseEntity<BaseResponse<DebtNote>> createDebtNote(
            @RequestBody DebtNoteCreateDTO dto,
            @CurrentUser User currentUser) {
        DebtNote createdDebtNote = debtNoteService.createDebtNote(dto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(createdDebtNote, "Debt note created successfully"));
    }

    /**
     * Cập nhật phiếu nợ
     */
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<DebtNote>> updateDebtNote(
            @PathVariable Long id,
            @RequestBody DebtNoteUpdateDTO dto,
            @CurrentUser User currentUser) {
        DebtNote updatedDebtNote = debtNoteService.updateDebtNote(id, dto, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(updatedDebtNote, "Debt note updated successfully"));
    }

    /**
     * Xóa phiếu nợ
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteDebtNote(
            @PathVariable Long id,
            @CurrentUser User currentUser) {
        debtNoteService.deleteDebtNote(id, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(null, "Debt note deleted successfully"));
    }
}
