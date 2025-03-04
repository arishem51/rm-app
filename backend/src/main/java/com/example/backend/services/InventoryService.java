package com.example.backend.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.dto.inventory.InventoryCreateDTO;
import com.example.backend.dto.inventory.InventoryUpdateDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.Product;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.entities.Warehouse;
import com.example.backend.repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductService productService;
    private final WarehouseService warehouseService;

    public List<Inventory> findAllInventoriesByShop(User currentUser, Long shopId) {
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
        if (!currentUser.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("You do not have permission to manage inventory for this shop.");
        }
        return inventoryRepository.findByWarehouse_ShopId(shopId);
    }

    public Page<Inventory> findInventories(int page, int pageSize, String search, User currentUser) {
        Shop shop = currentUser.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
        return search.isEmpty()
                ? inventoryRepository.findByWarehouse_ShopId(shop.getId(), PageRequest.of(page, pageSize))
                : inventoryRepository.findByWarehouse_ShopIdAndProduct_NameContainingIgnoreCase(shop.getId(), search,
                        PageRequest.of(page, pageSize));
    }

    public Inventory create(InventoryCreateDTO inventoryDto, User currentUser) {
        Product product = productService.findProductById(inventoryDto.getProductId(), currentUser);
        Warehouse warehouse = warehouseService.findWarehouseById(inventoryDto.getWarehouseId());
        Shop shop = currentUser.getShop();

        if (!shop.getId().equals(warehouse.getShop().getId())) {
            throw new IllegalArgumentException("You do not have permission to manage inventory for this warehouse.");
        }

        Inventory inventory = Inventory.builder()
                .product(product)
                .warehouse(warehouse)
                .quantity(inventoryDto.getQuantity())
                .createdBy(currentUser)
                .build();

        return inventoryRepository.save(inventory);
    }

    public Inventory update(Long id, InventoryUpdateDTO inventoryDto, User currentUser) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found!"));

        Product product = null;
        if (inventoryDto.getProductId() != null) {
            product = productService.findProductById(inventoryDto.getProductId(), currentUser);
        }

        Warehouse warehouse = warehouseService.findWarehouseById(inventoryDto.getWarehouseId());
        Shop shop = currentUser.getShop();

        if (!shop.getId().equals(warehouse.getShop().getId())) {
            throw new IllegalArgumentException("You do not have permission to manage inventory for this warehouse.");
        }

        if (product != null) {
            inventory.setProduct(product);
        }
        inventory.setWarehouse(warehouse);
        inventory.setQuantity(inventoryDto.getQuantity());

        return inventoryRepository.save(inventory);
    }

}
