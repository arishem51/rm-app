package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.entities.User;
import com.example.backend.dto.UpdateShopDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<BaseResponse<PaginateResponse<ShopDTO>>> getShops(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {

        try {
            Page<Shop> shops = shopService.findShops(page, pageSize, search, user);
            PaginateResponse<ShopDTO> response = new PaginateResponse<>(shops.map(ShopDTO::fromEntity));
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get shop by id", description = "Fetch shop details by shop id. Accessible only if the current user is an admin, staff or owner of the shop.")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<ShopDTO>> getShopById(@PathVariable("id") Long id, @CurrentUser User user) {
        try {
            Shop createdShop = shopService.findShopById(id, user);
            return ResponseEntity.ok().body(BaseResponse.success(ShopDTO.fromEntity(createdShop), "Create success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a shop", description = "Update a shop by its ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ShopDTO>> updateShop(
            @PathVariable Long id,
            @RequestBody UpdateShopDTO shopDTO,
            @CurrentUser User currentUser) {

        try {
            Shop updatedShop = shopService.updateShop(id, shopDTO, currentUser);
            return ResponseEntity
                    .ok(BaseResponse.success(ShopDTO.fromEntity(updatedShop), "Shop updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, "Failed to update shop"));
        }
    }

}
