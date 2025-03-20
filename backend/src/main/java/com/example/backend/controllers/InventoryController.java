package com.example.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.inventory.InventoryResponseDTO;
import com.example.backend.dto.inventory.InventoryUpdateDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.User;
import com.example.backend.services.InventoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@Tag(name = "Inventories Management", description = "Operations related to inventories")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @Operation(summary = "Get the inventories", description = "Fetch a list of the registered inventories.")
    @GetMapping("")
    public ResponseEntity<BaseResponse<PaginateResponse<InventoryResponseDTO>>> getInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String search,
            @CurrentUser User user) {

        try {
            Page<Inventory> items = inventoryService.findInventories(page, pageSize, search, user);
            PaginateResponse<InventoryResponseDTO> response = new PaginateResponse<>(items.map(
                    InventoryResponseDTO::fromEntity));
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get all inventories", description = "Fetch a list of all registered inventories.")
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<InventoryResponseDTO>>> getAllInventory(
            @CurrentUser User user) {
        try {
            List<Inventory> items = inventoryService.findAllInventoriesByShop(user);
            return ResponseEntity
                    .ok(new BaseResponse<>(items.stream().map(InventoryResponseDTO::fromEntity).toList(), "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get a inventory", description = "Update a inventory by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<InventoryResponseDTO>> getInventoryById(
            @PathVariable Long id,
            @CurrentUser User currentUser) {

        try {
            Inventory item = inventoryService.findInventoryById(id, currentUser);
            return ResponseEntity
                    .ok(BaseResponse.success(InventoryResponseDTO.fromEntity(item), "Shop updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a inventory", description = "Update a inventory by its ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<InventoryResponseDTO>> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryUpdateDTO dto,
            @CurrentUser User currentUser) {

        try {
            Inventory item = inventoryService.update(id, dto, currentUser);
            return ResponseEntity
                    .ok(BaseResponse.success(InventoryResponseDTO.fromEntity(item), "Shop updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }
}
