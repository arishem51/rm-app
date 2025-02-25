package com.example.backend.services;

import com.example.backend.dto.warehouse.WarehouseUpdateDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.repositories.WarehouseRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public Page<Warehouse> findShops(int page, int pageSize, String search, User user) {
        if (UserRoleUtils.isStaff(user)) {
            throw new IllegalArgumentException("You are not authorized to perform this action.");
        }
        if (UserRoleUtils.isAdmin(user)) {
            return search.isEmpty() ? warehouseRepository.findAll(PageRequest.of(page, pageSize))
                    : warehouseRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
        }
        Shop shop = user.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You You must have a shop to manage warehouses!");
        }
        return search.isEmpty() ? warehouseRepository.findAllByShopId(shop.getId(), PageRequest.of(page, pageSize))
                : warehouseRepository.findByNameContainingIgnoreCaseAndShopId(search, shop.getId(),
                        PageRequest.of(page, pageSize));
    }

    public Warehouse getWarehouseById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with ID: " + warehouseId));
    }

    public Warehouse createWarehouseByShop(Shop shop) {
        Warehouse warehouse = Warehouse.builder()
                .name("Warehouse")
                .address(shop.getAddress())
                .shop(shop)
                .build();
        return warehouseRepository.save(warehouse);
    }

    public Warehouse save(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, WarehouseUpdateDTO warehouseDTO, User admin) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
        return warehouseRepository.save(warehouse);
    }
}
