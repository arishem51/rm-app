package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.warehouse.WarehouseCreateDTO;
import com.example.backend.dto.warehouse.WarehouseDTO;
import com.example.backend.dto.warehouse.WarehouseUpdateDTO;
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

    // Lấy tất cả kho của cửa hàng
    @Operation(summary = "Get all warehouses of a shop", description = "Get all warehouses of a shop")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<PaginateResponse<WarehouseDTO>>> getWarehouses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {
        try {
            Page<Warehouse> warehouses = warehouseService.findShops(page, pageSize, search, user);
            PaginateResponse<WarehouseDTO> response = new PaginateResponse<>(warehouses.map(WarehouseDTO::fromEntity));
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    // Tạo kho mới cho cửa hàng
    @Operation(summary = "Create a new warehouse for a shop", description = "Create a new warehouse under the specified shop")
    @PostMapping("/{shopId}")
    public ResponseEntity<BaseResponse<Warehouse>> createWarehouse(
            @PathVariable Long shopId,
            @RequestBody WarehouseCreateDTO warehouseCreateDTO,
            @CurrentUser User user) {
        try {
            Warehouse warehouse = warehouseService.createWarehouse(shopId, warehouseCreateDTO, user);
            return ResponseEntity.ok(new BaseResponse<>(warehouse, "Warehouse created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    // Cập nhật kho theo ID
    @Operation(summary = "Update a warehouse by ID", description = "Update the details of an existing warehouse by ID")
    @PutMapping("/{warehouseId}")
    public ResponseEntity<BaseResponse<Warehouse>> updateWarehouse(
            @PathVariable Long warehouseId,
            @RequestBody WarehouseUpdateDTO warehouseUpdateDTO,
            @CurrentUser User user) {
        try {
            Warehouse warehouse = warehouseService.updateWarehouse(warehouseId, warehouseUpdateDTO, user);
            return ResponseEntity.ok(new BaseResponse<>(warehouse, "Warehouse updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
