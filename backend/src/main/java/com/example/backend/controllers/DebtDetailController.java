package com.example.backend.controllers;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.debtdetail.CreateDebtDetailDTO;
import com.example.backend.dto.debtdetail.DebtDetailResponseDTO;
import com.example.backend.entities.DebtNote;
import com.example.backend.enums.DebtStatus;
import com.example.backend.services.DebtDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/debt-details")
public class DebtDetailController {

    private final DebtDetailService debtDetailService;

    public DebtDetailController(DebtDetailService debtDetailService) {
        this.debtDetailService = debtDetailService;
    }

    @GetMapping("/{partnerId}")
    public ResponseEntity<BaseResponse<Page<DebtDetailResponseDTO>>> getDebtDetails(
            @PathVariable Long partnerId,
            @RequestParam(required = false) LocalDateTime fromDate,
            @RequestParam(required = false) LocalDateTime toDate,
            Pageable pageable) {

        Page<DebtDetailResponseDTO> debtDetailPage = debtDetailService.getDebtDetailsByDebtNoteIdAndFilter(
                partnerId, fromDate, toDate, pageable);

        return ResponseEntity.ok(new BaseResponse<>(debtDetailPage, "DebtDetails found successfully"));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<DebtDetailResponseDTO>> createDebtDetail(@RequestBody CreateDebtDetailDTO request) {
        // Gọi service để tạo mới DebtDetail
        DebtDetailResponseDTO createdDebtDetail = debtDetailService.createDebtDetail(request);

        // Trả về kết quả
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new BaseResponse<>(createdDebtDetail, "DebtDetail created successfully"));
    }


}

