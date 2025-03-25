package com.example.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.dto.zone.ZoneRequestDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.entities.Zone;
import com.example.backend.repositories.ZoneRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZoneService {
    private final ZoneRepository zoneRepository;
    private final ShopService shopService;
    private final WarehouseService warehouseService;

    public List<Zone> findAllZonesByShopId(User currentUser) {
        Shop shop = shopService.getShopById(currentUser.getShop().getId());
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage zones!");
        }
        return zoneRepository.findByWarehouse_ShopId(shop.getId());
    }

    public List<Zone> findAllZonesByWarehouseAndShop(Long warehouseId, User currentUser) {
        Warehouse warehouse = warehouseService.findWarehouseByIdAndShopId(warehouseId, currentUser);
        return zoneRepository.findByWarehouseIdAndWarehouse_ShopId(warehouseId, warehouse.getShop().getId());
    }

    public Zone create(ZoneRequestDTO dto, User currentUser) {
        Warehouse warehouse = warehouseService.findWarehouseByIdAndShopId(dto.getWarehouseId(),
                currentUser);
        Zone zone = Zone.builder().name(dto.getName()).description(dto.getDescription()).warehouse(warehouse).build();
        return zoneRepository.save(zone);
    }

    public Zone update(Long id, ZoneRequestDTO dto, User currentUser) {
        Warehouse warehouse = warehouseService.findWarehouseByIdAndShopId(dto.getWarehouseId(),
                currentUser);
        Zone zone = zoneRepository.findByIdAndWarehouse_ShopId(id, warehouse.getShop().getId())
                .orElseThrow(() -> new IllegalArgumentException("Zone not found!"));
        if (zone == null) {
            throw new IllegalArgumentException("Zone not found.");
        }
        if (dto.getName() != null) {
            zone.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            zone.setDescription(dto.getDescription());
        }
        return zoneRepository.save(zone);
    }
}
