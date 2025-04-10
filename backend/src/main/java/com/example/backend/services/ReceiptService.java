package com.example.backend.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.backend.dto.receipt.ReceiptCreateDTO;
import com.example.backend.dto.receipt.ReceiptRequestItemDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.InventoryHistory;
import com.example.backend.entities.Receipt;
import com.example.backend.entities.ReceiptItem;
import com.example.backend.entities.User;
import com.example.backend.entities.Zone;
import com.example.backend.enums.ReceiptStatus;
import com.example.backend.repositories.InventoryHistoryRepository;
import com.example.backend.repositories.InventoryRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.ReceiptRepository;
import com.example.backend.repositories.ZoneRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReceiptService {
    private final ReceiptRepository receiptRepository;
    private final ZoneRepository zoneRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;

    @Transactional
    public Receipt create(ReceiptCreateDTO dto, User currentUser) {
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("Bạn phải là chủ cửa hàng hoặc nhân viên của cửa hàng");
        }
        Receipt receipt = Receipt.builder().createdBy(currentUser).build();
        List<ReceiptItem> receiptItems = new ArrayList<>();
        List<Inventory> inventoriesToSave = new ArrayList<>();
        List<Zone> zonesToSave = new ArrayList<>();

        List<ReceiptRequestItemDTO> items = dto.getItems();
        Set<Long> zoneIds = new HashSet<>();
        for (ReceiptRequestItemDTO item : items) {
            zoneIds.add(item.getZoneId());
        }

        if (zoneIds.size() != items.size()) {
            throw new IllegalArgumentException("Khu vực nhập hàng bị trùng");
        }

        try {
            for (ReceiptRequestItemDTO item : items) {
                Zone zone = zoneRepository.findByIdAndWarehouse_ShopId(item.getZoneId(), currentUser.getShop().getId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Khu vực trong kho không tồn tại"));
                Inventory inventory = inventoryRepository.findByZone_Id(zone.getId()).orElse(null);

                if (inventory != null) {
                    if (inventory.getProduct().getId() != item.getProductId()) {
                        throw new IllegalArgumentException(
                                "Khu vực là: " + zone.getName() + " đã có sản phẩm khác");
                    }
                    if (inventory.getPackageValue() != item.getPackageValue()) {
                        throw new IllegalArgumentException(
                                "Khu vực là: " + zone.getName() + " đã có quy cách sản phẩm khác    ");
                    }
                    Integer quantity = inventory.getQuantity() + item.getQuantity();
                    inventory.setQuantity(quantity);
                } else {
                    inventory = Inventory.builder().zone(zone)
                            .product(productRepository.findById(item.getProductId())
                                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại")))
                            .quantity(item.getQuantity())
                            .packageValue(item.getPackageValue())
                            .createdBy(currentUser)
                            .build();
                }
                zone.setInventory(inventory);
                ReceiptItem receiptItem = ReceiptItem.builder().receipt(receipt).productId(item.getProductId())
                        .productName(inventory.getProduct().getName()).productPrice(item.getPrice())
                        .quantity(item.getQuantity()).zoneId(item.getZoneId()).zoneName(zone.getName())
                        .warehouseId(zone.getWarehouse().getId())
                        .warehouseName(zone.getWarehouse().getName())
                        .packageValue(inventory.getPackageValue())
                        .build();
                inventoriesToSave.add(inventory);
                zonesToSave.add(zone);
                receiptItems.add(receiptItem);
            }
        } catch (Exception e) {
            receipt.setStatus(ReceiptStatus.FAILED);
            receipt.setShop(currentUser.getShop());
            receiptRepository.save(receipt);
            System.out.println(e + " message: " + e.getMessage());
            throw new IllegalArgumentException("Lỗi khi tạo phiếu nhập. " + e.getMessage());
        }
        inventoryHistoryRepository.saveAll(inventoriesToSave.stream()
                .map(inv -> InventoryHistory.builder()
                        .inventory(inv)
                        .createdBy(currentUser)
                        .product(inv.getProduct())
                        .zone(inv.getZone())
                        .quantity(inv.getQuantity())
                        .packageValue(inv.getPackageValue())
                        .reason("Nhập hàng")
                        .build())
                .toList());
        inventoryRepository.saveAll(inventoriesToSave);
        zoneRepository.saveAll(zonesToSave);
        receipt.setStatus(ReceiptStatus.SUCCESS);
        receipt.setItems(receiptItems);
        receipt.setShop(currentUser.getShop());
        return receiptRepository.save(receipt);
    }

    public Page<Receipt> findReceipts(int page, int pageSize, String search, User user) {
        if (user.getShop() == null) {
            throw new IllegalArgumentException("Bạn phải là chủ cửa hàng hoặc nhân viên của cửa hàng");
        }
        return receiptRepository.findByShopId(user.getShop().getId(),
                PageRequest.of(page, pageSize));
    }

    public Receipt findReceipt(Long id, User user) {
        if (user.getShop() == null) {
            throw new IllegalArgumentException("Bạn phải là chủ cửa hàng hoặc nhân viên của cửa hàng");
        }

        return receiptRepository.findByIdAndShopId(id, user.getShop().getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu nhập"));
    }
}
