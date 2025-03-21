package com.example.backend.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.dto.inventory.InventoryUpdateDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.Product;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductService productService;
    private final WarehouseService warehouseService;

    public List<Inventory> findAllInventoriesByShop(User currentUser) {
        Shop shop = currentUser.getShop();
        Long shopId = shop.getId();
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
        if (!currentUser.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("You do not have permission to manage inventory for this shop.");
        }
        return inventoryRepository.findByZone_Warehouse_Shop_Id(shopId);
    }

    public Inventory findInventoryById(Long id, User currentUser) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found!"));
        // FIXME: Warehouse -> Zone
        // if
        // (!currentUser.getShop().getId().equals(inventory.getWarehouse().getShop().getId()))
        // {
        // throw new IllegalArgumentException("You do not have permission to manage
        // inventory for this shop.");
        // }
        return inventory;
    }

    public Page<Inventory> findInventories(int page, int pageSize, String search, User currentUser) {
        Shop shop = currentUser.getShop();
        if (shop == null) {
            throw new IllegalArgumentException("You must have a shop to manage products!");
        }
        return search.isEmpty()
                ? inventoryRepository.findByZone_Warehouse_Shop_Id(shop.getId(), PageRequest.of(page, pageSize))
                : inventoryRepository.findByZone_Warehouse_Shop_IdAndProduct_NameContainingIgnoreCase(shop.getId(),
                        search,
                        PageRequest.of(page, pageSize));
    }

    // public Inventory create(InventoryCreateDTO inventoryDto, User currentUser) {
    // Product product = productService.findProductById(inventoryDto.getProductId(),
    // currentUser);
    // Warehouse warehouse =
    // warehouseService.findWarehouseById(inventoryDto.getWarehouseId());
    // Shop shop = currentUser.getShop();

    // // FIXME: throw different message for product and warehouse
    // if (!shop.getId().equals(warehouse.getShop().getId()) ||
    // !shop.getId().equals(product.getShop().getId())) {
    // throw new IllegalArgumentException("You do not have permission to manage
    // inventory for this warehouse.");
    // }

    // Inventory inventory = Inventory.builder()
    // .product(product)
    // .warehouse(warehouse)
    // .quantity(inventoryDto.getQuantity())
    // .createdBy(currentUser)
    // .build();

    // return inventoryRepository.save(inventory);
    // }

    public Inventory update(Long id, InventoryUpdateDTO inventoryDto, User currentUser) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found!"));

        Product product = null;
        if (inventoryDto.getProductId() != null) {
            product = productService.findProductById(inventoryDto.getProductId(), currentUser);
        }
        // Warehouse warehouse =
        // warehouseService.findWarehouseById(inventoryDto.getWarehouseId());
        Shop shop = currentUser.getShop();
        // if (!shop.getId().equals(warehouse.getShop().getId()) ||
        // !shop.getId().equals(product.getShop().getId())) {
        // throw new IllegalArgumentException("You do not have permission to manage
        // inventory for this warehouse.");
        // }
        if (product != null) {
            inventory.setProduct(product);
        }
        // inventory.setWarehouse(warehouse);

        return inventoryRepository.save(inventory);
    }

}
