package com.example.backend.services;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.dto.inventory.InventoryUpdateDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.InventoryHistory;
import com.example.backend.entities.Product;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.entities.Zone;
import com.example.backend.repositories.InventoryHistoryRepository;
import com.example.backend.repositories.InventoryRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.ZoneRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {
        private final InventoryRepository inventoryRepository;
        private final ProductRepository productRepository;
        private final InventoryHistoryRepository inventoryHistoryRepository;
        private final ZoneRepository zoneRepository;

        public List<Inventory> findAllInventoriesByShop(User currentUser) {
                Shop shop = currentUser.getShop();
                Long shopId = shop.getId();
                if (currentUser.getShop() == null) {
                        throw new IllegalArgumentException("Bạn không có quyền truy cập vào kho hàng này!");
                }
                if (!currentUser.getShop().getId().equals(shopId)) {
                        throw new IllegalArgumentException(
                                        "You do not have permission to manage inventory for this shop.");
                }
                return inventoryRepository.findByZone_Warehouse_Shop_Id(shopId);
        }

        public Inventory findInventoryById(Long id, User currentUser) {
                Inventory inventory = inventoryRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Inventory not found!"));
                return inventory;
        }

        public Page<Inventory> findInventories(int page, int pageSize, String search, User currentUser) {
                Shop shop = currentUser.getShop();
                if (shop == null) {
                        throw new IllegalArgumentException("Bạn không có quyền truy cập vào kho hàng này!");
                }
                return search.isEmpty()
                                ? inventoryRepository.findByZone_Warehouse_Shop_Id(shop.getId(),
                                                PageRequest.of(page, pageSize))
                                : inventoryRepository.findByZone_Warehouse_Shop_IdAndProduct_NameContainingIgnoreCase(
                                                shop.getId(),
                                                search,
                                                PageRequest.of(page, pageSize));
        }

        public Page<InventoryHistory> findInventoryHistories(Long id, int page, int pageSize, String search,
                        User currentUser) {
                Shop shop = currentUser.getShop();
                if (shop == null) {
                        throw new IllegalArgumentException("Bạn không có quyền truy cập vào kho hàng này!");
                }
                return inventoryHistoryRepository.findByInventoryIdAndZone_Warehouse_Shop_Id(id, shop.getId(),
                                PageRequest.of(page, pageSize));
        }

        public Inventory update(Long id, InventoryUpdateDTO dto, User currentUser) {
                Shop shop = currentUser.getShop();
                if (shop == null) {
                        throw new IllegalArgumentException("Bạn không có quyền truy cập vào kho hàng này!");
                }
                Long shopId = shop.getId();
                Inventory inventory = inventoryRepository
                                .findByProduct_IdAndZone_Warehouse_Shop_Id(id,
                                                shopId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy kho hàng!"));

                Product updateProduct = inventory.getProduct().getId().equals(
                                Optional.ofNullable(dto.getProductId()).orElse(inventory.getProduct().getId()))
                                                ? inventory.getProduct()
                                                : productRepository.findByIdAndShopId(dto.getProductId(), shopId)
                                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                                "Không tìm thấy sản phẩm!"));

                Integer updateQuantity = Optional.ofNullable(dto.getQuantity()).orElse(inventory.getQuantity());
                Integer updatePackageValue = Optional.ofNullable(dto.getPackageValue())
                                .orElse(inventory.getPackageValue());
                Zone updateZone = inventory.getZone().getId().equals(
                                Optional.ofNullable(dto.getZoneId()).orElse(inventory.getZone().getId()))
                                                ? inventory.getZone()
                                                : zoneRepository.findByIdAndWarehouse_ShopId(dto.getZoneId(),
                                                                dto.getZoneId())
                                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                                "Không tìm thấy kho hàng!"));

                InventoryHistory inventoryHistory = InventoryHistory.builder()
                                .createdBy(currentUser)
                                .inventory(inventory)
                                .reason("Cập nhật thủ công")
                                .product(
                                                updateProduct)
                                .zone(updateZone)
                                .quantity(updateQuantity)
                                .packageValue(
                                                updatePackageValue)
                                .build();
                inventoryHistoryRepository.save(inventoryHistory);
                return inventoryRepository.save(inventory);
        }

}
