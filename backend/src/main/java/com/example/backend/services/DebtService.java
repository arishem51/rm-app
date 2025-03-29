package com.example.backend.services;

import com.example.backend.dto.debt.*;
import com.example.backend.entities.DebtNote;
import com.example.backend.repositories.*;
import com.example.backend.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DebtService {

    private final DebtNoteRepository debtNoteRepository;
    private final DebtRepositoryCustom debtRepositoryCustom;


    public List<DebtNoteWithPartnerDTO> getFilteredDebtNotes(String partnerName, Double minTotalAmount,
                                                          Double maxTotalAmount, LocalDateTime fromDate,
                                                          LocalDateTime toDate) {
        String userCreate = UserUtils.getAuthenticatedUsername();
        if (userCreate == null) {
            throw new RuntimeException("User not found");
        }
        List<DebtNoteWithPartnerDTO> list = debtNoteRepository.findDebtNotesWithPartner(
                partnerName, minTotalAmount, maxTotalAmount, fromDate, toDate, userCreate);

        return list;
    }

    private DebtNoteResponseDTO mapToDTO(DebtNote debtNote) {
        return DebtNoteResponseDTO.builder()
                .id(debtNote.getId())
                .partnerId(debtNote.getPartnerId())
                .totalAmount(debtNote.getTotalAmount())
                .createdAt(debtNote.getCreatedAt())
                .status(debtNote.getStatus())
                .source(debtNote.getSource())
                .description(debtNote.getDescription())
                .build();
    }



    public void createDebtNote(CreateDebtNoteDTO request) {
        String username = UserUtils.getAuthenticatedUsername();

        Optional<DebtNote> existingDebtNote = debtNoteRepository.findByPartnerIdAndCreatedBy(request.getPartnerId(), username);
        if (existingDebtNote.isPresent()) {
            throw new RuntimeException("Thông tin người nợ đã tồn tại trong danh sách cho người dùng " + username);
        } else {
            DebtNote debtNote = new DebtNote();
            debtNote.setPartnerId(request.getPartnerId());
            debtNote.setTotalAmount(request.getTotalAmount());
            debtNote.setSource(request.getSource());
            debtNote.setDescription(request.getDescription());
            debtNote.setCreatedBy(UserUtils.getAuthenticatedUsername());

            debtNoteRepository.save(debtNote);
        }


    }

    public DebtNoteResponseDTO getDebtNoteById(Long id) {
        DebtNote debtNote = debtNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DebtNote not found"));

        return mapToDTO(debtNote);
    }

    public void updateDebtNote(Long id, UpdateDebtNoteDTO request) {
        DebtNote existingDebtNote = debtNoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DebtNote not found"));

        existingDebtNote.setPartnerId(request.getPartnerId());
        existingDebtNote.setTotalAmount(request.getTotalAmount());
        existingDebtNote.setSource(request.getSource());
        existingDebtNote.setDescription(request.getDescription());
        existingDebtNote.setStatus(request.getStatus());

        debtNoteRepository.save(existingDebtNote);


    }

} 