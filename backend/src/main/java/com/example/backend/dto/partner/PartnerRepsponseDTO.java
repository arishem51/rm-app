package com.example.backend.dto.partner;

import com.example.backend.entities.Partner;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PartnerRepsponseDTO {
    private long id;
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private boolean canHaveDept;
    private String website;
    private String description;
    private long shopId;
    private String shopName;
    private String createdAt;
    private String updatedAt;

    public static PartnerRepsponseDTO fromEntity(Partner partner) {
        return PartnerRepsponseDTO.builder()
                .id(partner.getId())
                .name(partner.getName())
                .contactName(partner.getContactName())
                .phone(partner.getPhone())
                .email(partner.getEmail())
                .address(partner.getAddress())
                .canHaveDept(partner.isCanHaveDebt())
                .website(partner.getWebsite())
                .description(partner.getDescription())
                .shopId(partner.getShop().getId())
                .shopName(partner.getShop().getName())
                .createdAt(partner.getCreatedAt().toString())
                .updatedAt(partner.getUpdatedAt().toString())
                .build();
    }
}
