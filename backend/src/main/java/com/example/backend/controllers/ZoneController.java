package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.entities.User;
import com.example.backend.entities.Zone;
import com.example.backend.dto.zone.ZoneDTO;
import com.example.backend.dto.zone.ZoneRequestDTO;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.BaseResponse;
import com.example.backend.services.ZoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/zones")
@Tag(name = "Zone Management", description = "Operations related to zones")
@RequiredArgsConstructor
public class ZoneController {
    private final ZoneService zoneService;

    @Operation(summary = "Get all zones", description = "Fetch a list of all registered zones.")
    @GetMapping("")
    public ResponseEntity<BaseResponse<List<ZoneDTO>>> getAllZonesOfUser(
            @CurrentUser User user) {
        try {
            List<Zone> zones = zoneService.findAllZonesByShopId(user);
            List<ZoneDTO> response = zones.stream().map(ZoneDTO::fromEntity).toList();
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Get zones in warehouse", description = "Fetch a list of zones in a warehouse of a shop.")
    @GetMapping("/{warehouseId}")
    public ResponseEntity<BaseResponse<List<ZoneDTO>>> getZonesByWarehouseId(
            @PathVariable Long warehouseId,
            @CurrentUser User user) {
        try {
            List<Zone> zones = zoneService.findAllZonesByWarehouseAndShop(warehouseId, user);
            List<ZoneDTO> response = zones.stream().map(ZoneDTO::fromEntity).toList();
            return ResponseEntity.ok(new BaseResponse<>(response, "Success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Create a zone", description = "Create a zone by owner or staff of the shop.")
    @PostMapping("")
    public ResponseEntity<BaseResponse<ZoneDTO>> createZone(@RequestBody ZoneRequestDTO dto,
            @CurrentUser User user) {
        try {
            Zone zone = zoneService.create(dto, user);
            return ResponseEntity.ok().body(BaseResponse.success(ZoneDTO.fromEntity(zone), "Create success!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new BaseResponse<>(null, e.getMessage()));
        }
    }

    @Operation(summary = "Update a zone", description = "Update a zone by its ID.")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ZoneDTO>> updateShop(
            @PathVariable Long id,
            @RequestBody ZoneRequestDTO dto,
            @CurrentUser User currentUser) {
        try {
            Zone updatedShop = zoneService.update(id, dto, currentUser);
            return ResponseEntity
                    .ok(BaseResponse.success(ZoneDTO.fromEntity(updatedShop), "Zone updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new BaseResponse<>(null, e.getMessage()));
        }
    }

}
