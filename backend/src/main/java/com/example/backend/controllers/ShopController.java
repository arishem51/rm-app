package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.CreateShopDTO;
import com.example.backend.entities.User;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/create")
    public ResponseEntity<BaseResponse<Shop>> createShop(@RequestBody CreateShopDTO shopDTO, @CurrentUser User user) {
        Shop createdShop = shopService.createShop(shopDTO, user);
        if (createdShop != null) {
            return ResponseEntity.ok().body(BaseResponse.success(createdShop, "Create success!"));
        } else {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, "Name have exits!"));
        }
    }

    @GetMapping("/shop/staff")
    public List<User> getStaff(@RequestParam Long shopId){
        return shopService.getStaffByShop(shopId);
    }





}
