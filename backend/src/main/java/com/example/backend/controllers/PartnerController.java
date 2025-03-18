package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.partner.PartnerCreateDTO;
import com.example.backend.dto.partner.PartnerUpdateDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.User;
import com.example.backend.services.PartnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@Tag(name = "Partner Management", description = "Operations related to partners")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerService partnerService;

    @GetMapping
    public ResponseEntity<BaseResponse<PaginateResponse<Partner>>> getPartners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User currentUser) {
        Page<Partner> partners = partnerService.findPartners(page, pageSize, search, currentUser.getId());
        PaginateResponse<Partner> response = new PaginateResponse<>(partners);
        return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Partner>> getPartnerById(@PathVariable Long id, @CurrentUser User currentUser) {
        Partner partner = partnerService.getPartnerById(id, currentUser.getId());
        return ResponseEntity.ok(new BaseResponse<>(partner, "Success!"));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<Partner>> createPartner(@RequestBody PartnerCreateDTO partnerCreateDTO,
                                                               @CurrentUser User currentUser) {
        Partner partner = partnerService.create(partnerCreateDTO, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(partner, "Partner created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Partner>> updatePartner(@PathVariable Long id,
                                                               @RequestBody PartnerUpdateDTO partnerUpdateDTO,
                                                               @CurrentUser User currentUser) {
        Partner partner = partnerService.update(id, partnerUpdateDTO, currentUser);
        return ResponseEntity.ok(new BaseResponse<>(partner, "Partner updated successfully"));
    }
}