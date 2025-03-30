package com.example.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.backend.dto.partner.PartnerResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.backend.config.CurrentUser;
import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.dto.partner.PartnerUpdateDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.repositories.PartnerRepository;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository partnerRepository;
    private final ShopRepository shopRepository;

    public Page<PartnerResponseDTO> findPartners(int page, int pageSize, String search, User currentUser) {
        Pageable pageable = PageRequest.of(page, pageSize);
        if (UserRoleUtils.isAdmin(currentUser)) {
            return search.isEmpty()

                    ? partnerRepository.findAll(pageable).map(PartnerRepsponseDTO::fromEntity)
                    : partnerRepository.findByNameContainingIgnoreCase(search, pageable)
                            .map(PartnerRepsponseDTO::fromEntity);
        } else {
            return search.isEmpty()
                    ? partnerRepository.findByShopId(currentUser.getShop().getId(), pageable)
                            .map(PartnerRepsponseDTO::fromEntity)
                    : partnerRepository.findByShopIdAndNameContainingIgnoreCase(
                            currentUser.getShop().getId(),
                            search,
                            pageable).map(PartnerRepsponseDTO::fromEntity);

        }
    }

    public List<Partner> findAllPartners(User currentUser) {
        if (UserRoleUtils.isAdmin(currentUser)) {
            return partnerRepository.findAll();
        }
        if (!UserRoleUtils.isOwner(currentUser) || currentUser.getShop() == null) {
            throw new IllegalArgumentException("Unauthorized access");
        }
        return partnerRepository.findByShopId(currentUser.getShop().getId());
    }

    public Partner getPartnerById(Long id, User currentUser) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partner not found"));

        if (!UserRoleUtils.isAdmin(currentUser)) {
            if (!UserRoleUtils.isOwner(currentUser) ||
                    currentUser.getShop() == null ||
                    !partner.getShop().getId().equals(currentUser.getShop().getId())) {
                throw new IllegalArgumentException("Unauthorized access");
            }
        }

        return partner;
    }

    public PartnerResponseDTO getPartnerById(Long id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partner not found"));
        return PartnerResponseDTO.fromEntity(partner);
    }

    public Partner create(PartnerCreateDTO partnerDto, User currentUser) {
        var shop = shopRepository.findById(currentUser.getShop().getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cửa hàng!"));

        Partner partner = Partner.builder()
                .name(partnerDto.getName())
                .contactName(partnerDto.getContactName())
                .phone(partnerDto.getPhone())
                .email(partnerDto.getEmail())
                .address(partnerDto.getAddress())
                .website(partnerDto.getWebsite())
                .description(partnerDto.getDescription())
                .canHaveDebt(partnerDto.isCanHaveDebt())
                .totalDebtAmount(0.0)
                .shop(shop)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        partnerRepository.save(partner);
        return partner;
    }

    public Partner update(Long id, PartnerUpdateDTO partnerDto, @CurrentUser User currentUser) {
        if (!UserRoleUtils.isAdmin(currentUser) || !UserRoleUtils.isOwner(currentUser)) {
            throw new IllegalArgumentException("You are not authorized to perform this action");
        }
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partner not found"));

        // If owner, can only update their shop's partners
        if (UserRoleUtils.isOwner(currentUser) &&
                !partner.getShop().getId().equals(currentUser.getShop().getId())) {
            throw new IllegalArgumentException("You can only update partners from your own shop");
        }
        partner.setName(partnerDto.getName());
        partner.setContactName(partnerDto.getContactName());
        partner.setPhone(partnerDto.getPhone());
        partner.setEmail(partnerDto.getEmail());
        partner.setAddress(partnerDto.getAddress());
        partner.setWebsite(partnerDto.getWebsite());
        partner.setDescription(partnerDto.getDescription());
        partner.setCanHaveDebt(partnerDto.isCanHaveDebt());

        return partnerRepository.save(partner);
    }

    public void delete(Long id, User currentUser) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partner not found"));

        if (!UserRoleUtils.isAdmin(currentUser)) {
            if (!UserRoleUtils.isOwner(currentUser) ||
                    currentUser.getShop() == null ||
                    !partner.getShop().getId().equals(currentUser.getShop().getId())) {
                throw new IllegalArgumentException("You can only delete partners from your own shop");
            }
        }

        partnerRepository.deleteById(id);
    }

    public Optional<Partner> findById(Long id) {
        return partnerRepository.findById(id);
    }
}
