package com.example.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.entities.Shop;
import com.example.backend.services.ShopService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shops")
@Tag(name = "Shop Management", description = "Operations related to shops")
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @Operation(summary = "Get all shops", description = "Fetch a list of all registered shops.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Shop>>> getShops(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search) {
        Page<Shop> shops = shopService.findShops(page, pageSize, search);
        PaginateResponse<Shop> response = new PaginateResponse<>(shops);
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<Shop>>(response, "Success!"));
    }

    




}
