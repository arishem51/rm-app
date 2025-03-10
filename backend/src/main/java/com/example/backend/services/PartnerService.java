package com.example.backend.services;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.config.CurrentUser;
import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.dto.partner.PartnerUpdateDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.PartnerRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository partnerRepository;

    public Page<Partner> findPartners(int page, int pageSize, String search) {
        return search.isEmpty() ? partnerRepository.findAll(PageRequest.of(page, pageSize))
                : partnerRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));

    }

    public List<Partner> findAllPartners() {
        return partnerRepository.findAll();
    }

    public Partner getPartnerById(Long id) {
        return partnerRepository.findById(id).orElse(null);
    }

    public Partner create(PartnerCreateDTO partnerDto, User currentUser) {

        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }

        // FIXME: should we validate duplicate phone number, email, tax ID, etc.?

        Partner partner = Partner.builder()
                .name(partnerDto.getName())
                .contactName(partnerDto.getContactName())
                .phone(partnerDto.getPhone())
                .email(partnerDto.getEmail())
                .address(partnerDto.getAddress())
                .website(partnerDto.getWebsite())
                .description(partnerDto.getDescription())
                .build();

        partnerRepository.save(partner);
        return partner;
    }

    public Partner update(Long id, PartnerUpdateDTO partnerDto, @CurrentUser User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }
        Optional<Partner> dbPartner = partnerRepository.findById(id);
        if (dbPartner.isEmpty()) {
            throw new IllegalArgumentException("Partner not found");
        }

        Partner partner = dbPartner.get();
        partner.setName(partnerDto.getName());
        partner.setContactName(partnerDto.getContactName());
        partner.setPhone(partnerDto.getPhone());
        partner.setEmail(partnerDto.getEmail());
        partner.setAddress(partnerDto.getAddress());
        partner.setWebsite(partnerDto.getWebsite());
        partner.setDescription(partnerDto.getDescription());
        partnerRepository.save(partner);

        partnerRepository.save(partner);
        return partner;
    }

    public void delete(Long id, @CurrentUser User currentUser) {
        if (currentUser.getRole() == Role.STAFF) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }
        if (!partnerRepository.existsById(id)) {
            throw new IllegalArgumentException("Supplier not found");
        }
        partnerRepository.deleteById(id);
    }

    public Optional<Partner> findById(Long id) {
        return partnerRepository.findById(id);
    }
}
