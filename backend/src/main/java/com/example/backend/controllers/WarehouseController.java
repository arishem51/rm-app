package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.services.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
@Tag(name = "Warehouse Management", description = "Operations related to warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @Operation(summary = "Get all warehouses of a shop", description = "Get all warehouses of a shop")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<Warehouse>>> getWarehouses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {

        try {
            Page<Warehouse> warehouses = warehouseService.findShops(page, pageSize, search, user);
            PaginateResponse<Warehouse> response = new PaginateResponse<>(warehouses);
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
