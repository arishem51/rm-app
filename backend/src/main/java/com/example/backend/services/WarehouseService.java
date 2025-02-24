package com.example.backend.services;

import com.example.backend.dto.warehouse.WarehouseCreateDTO;
import com.example.backend.dto.warehouse.WarehouseUpdateDTO;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.repositories.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public Warehouse getWarehouseById(Long warehouseId) {
        return warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with ID: " + warehouseId));
    }

    public Warehouse createWarehouse(WarehouseCreateDTO warehouseDTO, User admin) {
        // Kiểm tra và tạo kho mới
        Warehouse warehouse = Warehouse.builder()
                .name(warehouseDTO.getName())
                .location(warehouseDTO.getLocation())
                .admin(admin)  // Admin tạo kho
                .build();

        return warehouseRepository.save(warehouse);
    }
    public Warehouse save(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, WarehouseUpdateDTO warehouseDTO, User admin) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));

        // Kiểm tra xem admin có quyền cập nhật không
        if (!warehouse.getAdmin().getId().equals(admin.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this warehouse!");
        }

        // Cập nhật thông tin kho
        if (warehouseDTO.getName() != null) {
            warehouse.setName(warehouseDTO.getName());
        }
        if (warehouseDTO.getLocation() != null) {
            warehouse.setLocation(warehouseDTO.getLocation());
        }

        return warehouseRepository.save(warehouse);
    }
}
