package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.dto.partner.PartnerRepsponseDTO;
import com.example.backend.dto.partner.PartnerUpdateDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.enums.ErrorCode;
import com.example.backend.services.PartnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@Tag(name = "Partner Management", description = "Operations related to partners")
@RequiredArgsConstructor
public class PartnerController {
    @Autowired
    private final PartnerService partnerService;

    @GetMapping
    public ResponseEntity<BaseResponse<PaginateResponse<PartnerRepsponseDTO>>> getPartners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User currentUser) {
        try {
            Page<PartnerRepsponseDTO> partners = partnerService.findPartners(page, pageSize, search, currentUser);
            PaginateResponse<PartnerRepsponseDTO> response = new PaginateResponse<>(partners);
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all Partners", description = "Fetch all Partners.")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<Partner>>> getAllPartners(@CurrentUser User currentUser) {
        try {
            List<Partner> partners = partnerService.findAllPartners(currentUser);
            return ResponseEntity.ok(new BaseResponse<>(partners, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Partner>> getPartnerById(@PathVariable Long id, @CurrentUser User currentUser) {
        try {
            Partner partner = partnerService.getPartnerById(id, currentUser);
            if (partner == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(null, "Partner not found", ErrorCode.BAD_REQUEST));
            }
            return ResponseEntity.ok(new BaseResponse<>(partner, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Partner>> createPartner(@RequestBody @Valid PartnerCreateDTO partner,
                                                               @CurrentUser User currentUser) {
        try {
            Partner createdPartner = partnerService.create(partner, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(createdPartner, "Partner created successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Partner>> updatePartner(@PathVariable Long id,
                                                               @RequestBody PartnerUpdateDTO updatedPartner, @CurrentUser User currentUser) {
       try {
           if (partnerService.getPartnerById(id, currentUser) == null) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND)
                       .body(new BaseResponse<>(null, "Partner not found", ErrorCode.BAD_REQUEST));
           }
           Partner savedPartner = partnerService.update(id, updatedPartner, currentUser);
           return ResponseEntity.ok(new BaseResponse<>(savedPartner, "Partner updated successfully", null));
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body(new BaseResponse<>(null, e.getMessage()));
       }
    }
}
