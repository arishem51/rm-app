package com.example.backend.dto.debt;

import com.example.backend.enums.DebtStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class DebtNoteWithPartnerDTO implements Serializable {
    private Long id;
    private Double totalAmount;
    private DebtStatus status;
    private String source;
    private String description;
    private String partnerName;
    private String partnerAddress;
    private String partnerPhone;
    private LocalDateTime createdAt;

    public DebtNoteWithPartnerDTO(Long id, Double totalAmount, DebtStatus status, String source, String description,
                                  String partnerName, String partnerAddress, String partnerPhone, LocalDateTime createdAt) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.status = status;
        this.source = source;
        this.description = description;
        this.partnerName = partnerName;
        this.partnerAddress = partnerAddress;
        this.partnerPhone = partnerPhone;
        this.createdAt = createdAt;
    }

    // Getters and setters
}

