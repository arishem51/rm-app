package com.example.backend.services;

import com.example.backend.dto.debtdetail.CreateDebtDetailDTO;
import com.example.backend.dto.debtdetail.DebtDetailResponseDTO;
import com.example.backend.entities.DebtDetail;
import com.example.backend.entities.DebtNote;
import com.example.backend.enums.DebtStatus;
import com.example.backend.repositories.DebtDetailRepository;
import com.example.backend.repositories.DebtNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class DebtDetailService {

    @Autowired
    private DebtDetailRepository debtDetailRepository;

    @Autowired
    private DebtNoteRepository debtNoteRepository;

    public Page<DebtDetailResponseDTO> getDebtDetailsByDebtNoteIdAndFilter(
            Long debtNoteId,
            DebtStatus status,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Pageable pageable) {

        Page<DebtDetail> debtDetailsPage = debtDetailRepository.findDebtDetailsByDynamicCriteria(
                debtNoteId, status, fromDate, toDate, pageable);

        List<DebtDetailResponseDTO> debtDetailResponseDTOs = debtDetailsPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(debtDetailResponseDTOs, pageable, debtDetailsPage.getTotalElements());
    }

    // Convert DebtDetail to DebtDetailResponseDTO
    private DebtDetailResponseDTO mapToDTO(DebtDetail debtDetail) {
        return new DebtDetailResponseDTO(
                debtDetail.getId(),
                debtDetail.getDueDate(),
                debtDetail.getCreatedAt(),
                debtDetail.getIsPlus(),
                debtDetail.getAmount(),
                debtDetail.getDescription(),
                debtDetail.getDebtNote().getId()
        );
    }

    public DebtDetailResponseDTO createDebtDetail(CreateDebtDetailDTO request) {
        DebtDetail debtDetail = new DebtDetail();

        // Cập nhật các trường trong DebtDetail từ request
        debtDetail.setAmount(request.getAmount());
        debtDetail.setDueDate(request.getDueDate());
        debtDetail.setIsPlus(request.getIsPlus());
        debtDetail.setDescription(request.getDescription());


        // Tìm DebtNote theo ID
        DebtNote debtNote = new DebtNote();
        debtNote.setId(request.getDebtNoteId());
        debtDetail.setDebtNote(debtNote);

        // Lưu DebtDetail
        debtDetailRepository.save(debtDetail);

        Optional<DebtNote> existedDebtNote = debtNoteRepository.findById(request.getDebtNoteId());
        if (existedDebtNote.isPresent()) {
            DebtNote debtNoteToUpdate = existedDebtNote.get();

            // Kiểm tra isPlus và cập nhật totalAmount trong DebtNote
            if (debtDetail.getIsPlus()) {
                // Nếu isPlus = true, cộng vào totalAmount
                debtNoteToUpdate.setTotalAmount(debtNoteToUpdate.getTotalAmount() + request.getAmount());
            } else {
                // Nếu isPlus = false, trừ đi totalAmount
                debtNoteToUpdate.setTotalAmount(debtNoteToUpdate.getTotalAmount() - request.getAmount());
            }

            // Lưu DebtNote với totalAmount đã được cập nhật
            debtNoteRepository.save(debtNoteToUpdate);

            // Chuyển DebtDetail thành DTO và trả về
            return mapToDTO(debtDetail);
        }else {
            throw new RuntimeException("DebtNote không tồn tại.");
        }
    }
}

