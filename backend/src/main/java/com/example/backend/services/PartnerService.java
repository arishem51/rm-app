package com.example.backend.services;

import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.dto.partner.PartnerUpdateDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.repositories.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository partnerRepository;

    public Page<Partner> findPartners(int page, int pageSize, String search, Long ownerId) {
        return partnerRepository.findByOwnerIdAndNameContainingIgnoreCase(ownerId, search, PageRequest.of(page, pageSize));
    }

    public List<Partner> findAllPartners(Long ownerId) {
        return partnerRepository.findByOwnerId(ownerId);
    }

    public Partner getPartnerById(Long id, Long ownerId) {
        Optional<Partner> partner = partnerRepository.findById(id);
        if (partner.isPresent() && partner.get().getOwnerId().equals(ownerId)) {
            return partner.get();
        }
        throw new IllegalArgumentException("Partner not found or you are not authorized to access it");
    }

    public Partner create(PartnerCreateDTO partnerCreateDTO, User currentUser) {
        if (!currentUser.getRole().equals("OWNER")) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }

        Partner partner = Partner.builder()
                .name(partnerCreateDTO.getName())
                .contactName(partnerCreateDTO.getContactName())
                .phone(partnerCreateDTO.getPhone())
                .email(partnerCreateDTO.getEmail())
                .address(partnerCreateDTO.getAddress())
                .website(partnerCreateDTO.getWebsite())
                .description(partnerCreateDTO.getDescription())
                .ownerId(currentUser.getId()) // Set ownerId
                .build();

        return partnerRepository.save(partner);
    }

    public Partner update(Long id, PartnerUpdateDTO partnerUpdateDTO, User currentUser) {
        Optional<Partner> dbPartner = partnerRepository.findById(id);
        if (dbPartner.isEmpty() || !dbPartner.get().getOwnerId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Partner not found or you are not authorized to update it");
        }

        Partner partner = dbPartner.get();
        partner.setName(partnerUpdateDTO.getName());
        partner.setContactName(partnerUpdateDTO.getContactName());
        partner.setPhone(partnerUpdateDTO.getPhone());
        partner.setEmail(partnerUpdateDTO.getEmail());
        partner.setAddress(partnerUpdateDTO.getAddress());
        partner.setWebsite(partnerUpdateDTO.getWebsite());
        partner.setDescription(partnerUpdateDTO.getDescription());
        return partnerRepository.save(partner);
    }
}