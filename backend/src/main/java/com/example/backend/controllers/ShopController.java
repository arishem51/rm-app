package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.CreateShopDTO;
import com.example.backend.entities.User;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.ShopDTO;
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
    public ResponseEntity<BaseResponse<PaginateResponse<ShopDTO>>> getShops(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "") String search) {
        Page<ShopDTO> shops = shopService.findShops(page, pageSize, search);
        PaginateResponse<ShopDTO> response = new PaginateResponse<>(shops);
        return ResponseEntity.ok(new BaseResponse<PaginateResponse<ShopDTO>>(response, "Success!"));
    }

    @PostMapping("/create")
    public ResponseEntity<BaseResponse<ShopDTO>> createShop(@RequestBody CreateShopDTO shopDTO,
            @CurrentUser User user) {
        try {
            Shop createdShop = shopService.createShop(shopDTO, user);
            return ResponseEntity.ok().body(BaseResponse.success(ShopDTO.fromEntity(createdShop), "Create success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
