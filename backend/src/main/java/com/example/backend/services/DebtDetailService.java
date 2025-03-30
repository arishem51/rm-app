package com.example.backend.services;

import com.example.backend.dto.debtdetail.CreateDebtDetailDTO;
import com.example.backend.dto.debtdetail.DebtDetailResponseDTO;
import com.example.backend.entities.DebtDetail;
import com.example.backend.entities.DebtNote;
import com.example.backend.entities.Partner;
import com.example.backend.enums.DebtStatus;
import com.example.backend.repositories.DebtDetailRepository;
import com.example.backend.repositories.DebtNoteRepository;
import com.example.backend.repositories.PartnerRepository;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class DebtDetailService {

    private final DebtDetailRepository debtDetailRepository;
    private final PartnerRepository partnerRepository;

    public Page<DebtDetailResponseDTO> getDebtDetailsByDebtNoteIdAndFilter(
            Long partnerId,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Pageable pageable) {

        Page<DebtDetail> debtDetailsPage = debtDetailRepository.findDebtDetailsByDynamicCriteria(
                partnerId, fromDate, toDate, pageable);

        List<DebtDetailResponseDTO> debtDetailResponseDTOs = debtDetailsPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(debtDetailResponseDTOs, pageable, debtDetailsPage.getTotalElements());
    }

    // Convert DebtDetail to DebtDetailResponseDTO
    private DebtDetailResponseDTO mapToDTO(DebtDetail debtDetail) {
        return new DebtDetailResponseDTO(
                debtDetail.getId(),
                debtDetail.getCreatedAt(),
                debtDetail.getIsPlus(),
                debtDetail.getAmount(),
                debtDetail.getDescription(),
                debtDetail.getPartnerId()
        );
    }

    public DebtDetailResponseDTO createDebtDetail(CreateDebtDetailDTO request) {
        DebtDetail debtDetail = new DebtDetail();

        debtDetail.setAmount(request.getAmount());
        debtDetail.setIsPlus(request.getIsPlus());
        debtDetail.setDescription(request.getDescription());
        debtDetail.setPartnerId(request.getPartnerId());

        if (request.getCreatedAt() == null) {
            debtDetail.setCreatedAt(LocalDateTime.now());
        } else {
            debtDetail.setCreatedAt(request.getCreatedAt());
        }

        Optional<Partner> existedPartner = partnerRepository.findById(request.getPartnerId());
        if (existedPartner.isPresent()) {
            Partner partnerToUpdate = existedPartner.get();

            if (debtDetail.getIsPlus()) {
                partnerToUpdate.setTotalDebtAmount(partnerToUpdate.getTotalDebtAmount() + request.getAmount());
            } else {
                partnerToUpdate.setTotalDebtAmount(partnerToUpdate.getTotalDebtAmount() - request.getAmount());
            }

            partnerRepository.save(partnerToUpdate);

        } else {
            throw new RuntimeException("DebtNote không tồn tại.");
        }

        debtDetailRepository.save(debtDetail);
        return mapToDTO(debtDetail);
    }
}

