package com.example.backend.services;

import com.example.backend.dto.warehouse.WarehouseCreateDTO;
import com.example.backend.dto.warehouse.WarehouseUpdateDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.enums.ActionStatus;
import com.example.backend.repositories.WarehouseRepository;
import com.example.backend.repositories.ZoneRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final ZoneRepository zoneRepository;

    public void validateUserCanManageWarehouse(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage warehouses!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage warehouses!");
        }
    }

    public int countZoneInWarehouse(Long warehouseId) {
        return zoneRepository.countByWarehouse_Id(warehouseId);
    }

    public Map<Long, Integer> getWarehouseZoneCount() {
        List<Object[]> zoneCounts = zoneRepository.countZonesByWarehouse();
        Map<Long, Integer> warehouseZoneCountMap = new HashMap<>();

        for (Object[] result : zoneCounts) {
            Long warehouseId = (Long) result[0];
            Long count = (Long) result[1];
            warehouseZoneCountMap.put(warehouseId, count.intValue());
        }

        return warehouseZoneCountMap;
    }

    public Warehouse createWarehouse(Long shopId, WarehouseCreateDTO dto, User user) {
        validateUserCanManageWarehouse(user);
        Shop shop = user.getShop();
        if (!shop.getId().equals(shopId)) {
            throw new IllegalArgumentException("You do not have permission to create a warehouse for this shop.");
        }

        Warehouse warehouse = Warehouse.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .shop(shop)
                .status(ActionStatus.ACTIVE)
                .build();
        return warehouseRepository.save(warehouse);
    }

    public Warehouse createWarehouseByShop(Shop shop) {
        Warehouse warehouse = new Warehouse();
        warehouse.setName("Kho - " + shop.getName());
        warehouse.setShop(shop);
        warehouse.setAddress(shop.getAddress());
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long warehouseId, WarehouseUpdateDTO dto, User user) {
        validateUserCanManageWarehouse(user);
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));

        Shop shop = user.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage warehouses!");
        }
        if (!warehouse.getShop().getId().equals(shop.getId())) {
            throw new IllegalArgumentException("You can only update warehouses from your own shop!");
        }
        if (dto.getName() != null) {
            warehouse.setName(dto.getName());
        }
        if (dto.getName() != null) {
            warehouse.setAddress(dto.getAddress());
        }
        if (dto.getDescription() != null) {
            warehouse.setDescription(dto.getDescription());
        }
        warehouse.setStatus(ActionStatus.valueOf(dto.getStatus()));

        return warehouseRepository.save(warehouse);
    }

    // Lấy kho theo shopId
    public Page<Warehouse> findShops(int page, int pageSize, String search, User user) {
        if (UserRoleUtils.isStaff(user)) {
            throw new IllegalArgumentException("You are not authorized to perform this action.");
        }
        if (UserRoleUtils.isAdmin(user)) {
            return search.isEmpty()
                    ? warehouseRepository.findAll(PageRequest.of(page, pageSize))
                    : warehouseRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
        }

        Shop shop = user.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage warehouses!");
        }

        return search.isEmpty()
                ? warehouseRepository.findAllByShopId(shop.getId(), PageRequest.of(page, pageSize))
                : warehouseRepository.findByNameContainingIgnoreCaseAndShopId(search, shop.getId(),
                        PageRequest.of(page, pageSize));
    }

    // Lấy kho theo warehouseId và shopId
    public Warehouse findWarehouseById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with ID: " + warehouseId));
    }

    public List<Warehouse> findAllWarehousesFromShop(Long shopId, User currentUser) {
        if (currentUser.getShop() == null || !currentUser.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("You do not have permission to view warehouses from this shop.");
        }
        return warehouseRepository.findAllByShopId(shopId);
    }

    public Warehouse findWarehouseByIdAndShopId(Long warehouseId, User currentUser) {
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage warehouses!");
        }
        return warehouseRepository.findByIdAndShopId(warehouseId,
                currentUser.getShop().getId())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with ID: " + warehouseId));
    }

}
