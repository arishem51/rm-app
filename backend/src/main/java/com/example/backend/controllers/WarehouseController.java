package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.warehouse.WarehouseCreateDTO;
import com.example.backend.dto.warehouse.WarehouseUpdateDTO;
import com.example.backend.entities.Warehouse;
import com.example.backend.entities.User;
import com.example.backend.services.WarehouseService;
import com.example.backend.utils.UserRoleUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
@Tag(name = "Warehouse Management", description = "Operations related to warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @Operation(summary = "Create a warehouse", description = "Create a warehouse, only accessible by owner.")
    @PostMapping()
    public ResponseEntity<BaseResponse<Warehouse>> createWarehouse(
            @RequestBody WarehouseCreateDTO warehouseDTO,
            @CurrentUser User user) {
        if (UserRoleUtils.isStaff(user)) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(null, "You are not authorized to create a warehouse!"));
        }
        Warehouse createdWarehouse = warehouseService.createWarehouse(warehouseDTO, user);
        return ResponseEntity.ok(BaseResponse.success(createdWarehouse, "Warehouse created successfully!"));
    }

    @Operation(summary = "Update a warehouse", description = "Update an existing warehouse by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Warehouse>> updateWarehouse(
            @PathVariable Long id,
            @RequestBody WarehouseUpdateDTO warehouseDTO,
            @CurrentUser User user) {
        if (UserRoleUtils.isStaff(user)) {
            return ResponseEntity.badRequest()
                    .body(new BaseResponse<>(null, "You are not authorized to update a warehouse!"));
        }
        Warehouse updatedWarehouse = warehouseService.updateWarehouse(id, warehouseDTO, user);
        return ResponseEntity.ok(BaseResponse.success(updatedWarehouse, "Warehouse updated successfully!"));
    }
}
