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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
@Tag(name = "Warehouse Management", description = "Operations related to warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @Operation(summary = "Get paginate warehouses of a shop", description = "Get paginate warehouses of a shop")
    @GetMapping("")
    public ResponseEntity<BaseResponse<PaginateResponse<WarehouseDTO>>> getWarehouses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String address,
            @RequestParam(defaultValue = "") String zone,
            @CurrentUser User user) {
        try {
            Page<Warehouse> warehouses = warehouseService.findShops(page, pageSize, search, user, address);
            Map<Long, Integer> warehouseZoneCountMap = warehouseService.getWarehouseZoneCount();
            Page<WarehouseDTO> list = warehouses.map(warehouse -> {
                int zoneCount = warehouseZoneCountMap.getOrDefault(warehouse.getId(), 0);
                return WarehouseDTO.fromEntity(warehouse, zoneCount);
            });

            Integer zoneFilter = null;
            if (!zone.isEmpty()) {
                try {
                    zoneFilter = Integer.parseInt(zone);
                    if (zoneFilter < 0) {
                        zoneFilter = null;
                    }
                } catch (NumberFormatException e) {
                    zoneFilter = null;
                }
            }
            final Integer finalZoneFilter = zoneFilter;
            List<WarehouseDTO> filteredList;
            if (zoneFilter != null) {
                filteredList = list.getContent().stream()
                        .filter(warehouseDTO -> warehouseDTO.getNumberOfZone() == finalZoneFilter)
                        .collect(Collectors.toList());
            } else {
                filteredList = list.getContent();
            }

            Page<WarehouseDTO> lFilter = new PageImpl<>(filteredList, PageRequest.of(page, pageSize),
                    list.getTotalElements());

            PaginateResponse<WarehouseDTO> response = new PaginateResponse<>(lFilter);

            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all warehouses of a shop", description = "Get all warehouses of a shop")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<WarehouseDTO>>> getAllWarehouses(
            Long shopId,
            @CurrentUser User user) {
        try {
            List<Warehouse> warehouses = warehouseService.findAllWarehousesFromShop(shopId, user);
            Map<Long, Integer> warehouseZoneCountMap = warehouseService.getWarehouseZoneCount();

            List<WarehouseDTO> response = warehouses.stream().map(warehouse -> {
                int zoneCount = warehouseZoneCountMap.getOrDefault(warehouse.getId(), 0);
                return WarehouseDTO.fromEntity(warehouse, zoneCount);
            })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get details warehouse of a shop", description = "Get details warehouse of a shop")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<WarehouseDTO>> getWarehouseDetail(
            @PathVariable Long id,
            @CurrentUser User user) {
        try {
            Warehouse warehouse = warehouseService.findWarehouseByIdAndShopId(id, user);
            int zoneCount = warehouseService.countZoneInWarehouse(id);
            WarehouseDTO response = WarehouseDTO.fromEntity(warehouse, zoneCount);
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Create a new warehouse for a shop", description = "Create a new warehouse under the specified shop")
    @PostMapping("/{shopId}")
    public ResponseEntity<BaseResponse<Warehouse>> createWarehouse(
            @PathVariable Long shopId,
            @Valid @RequestBody WarehouseCreateDTO warehouseCreateDTO,
            @CurrentUser User user) {
        try {
            Warehouse warehouse = warehouseService.createWarehouse(shopId, warehouseCreateDTO, user);
            return ResponseEntity.ok(new BaseResponse<>(warehouse, "Warehouse created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a warehouse by ID", description = "Update the details of an existing warehouse by ID")
    @PutMapping("/{warehouseId}")
    public ResponseEntity<BaseResponse<Warehouse>> updateWarehouse(
            @PathVariable Long warehouseId,
            @Valid @RequestBody WarehouseUpdateDTO warehouseUpdateDTO,
            @CurrentUser User user) {
        try {
            Warehouse warehouse = warehouseService.updateWarehouse(warehouseId, warehouseUpdateDTO, user);
            return ResponseEntity.ok(new BaseResponse<>(warehouse, "Warehouse updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
