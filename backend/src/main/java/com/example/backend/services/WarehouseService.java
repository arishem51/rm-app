package com.example.backend.services;

import com.example.backend.dto.warehouse.WarehouseCreateDTO;
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

    // Kiểm tra quyền của người dùng để quản lý kho
    private void validateUserCanManageWarehouse(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage warehouses!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage warehouses!");
        }
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
                .build();

        return warehouseRepository.save(warehouse);
    }

    public Warehouse createWarehouseByShop(Shop shop) {
        // Tạo kho mới cho shop
        Warehouse warehouse = new Warehouse();
        warehouse.setName("Warehouse - " + shop.getName()); // Tên kho có thể dựa trên tên shop
        warehouse.setShop(shop);
        warehouse.setAddress(shop.getAddress());
        // Cài đặt các thuộc tính khác của warehouse nếu cần
        return warehouseRepository.save(warehouse);
    }

    // Cập nhật kho theo warehouseId và shopId
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

}
