package com.example.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.PaginateResponse;
import com.example.backend.dto.inventory.InventoryCreateDTO;
import com.example.backend.dto.inventory.InventoryResponseDTO;
import com.example.backend.dto.inventory.InventoryUpdateDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.User;
import com.example.backend.services.InventoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventories")
@Tag(name = "Inventories Management", description = "Operations related to inventories")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @Operation(summary = "Get all inventories", description = "Fetch a list of all registered inventories.")
    @GetMapping("/")
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

    @Operation(summary = "Create a inventory", description = "Create a inventory with the provided data.")
    @PostMapping("/")
    public ResponseEntity<BaseResponse<InventoryResponseDTO>> createInventory(
            @RequestBody @Valid InventoryCreateDTO inventoryDto,
            @CurrentUser User currentUser) {
        try {
            Inventory createdInventory = inventoryService.create(inventoryDto, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(InventoryResponseDTO.fromEntity(createdInventory),
                            "Inventory created successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a inventories", description = "Update a inventories by its ID.")
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
