package com.example.backend.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import com.example.backend.dto.receipt.ReceiptCreateDTO;
import com.example.backend.dto.receipt.ReceiptRequestItemDTO;
import com.example.backend.entities.Inventory;
import com.example.backend.entities.Receipt;
import com.example.backend.entities.ReceiptItem;
import com.example.backend.entities.User;
import com.example.backend.entities.Zone;
import com.example.backend.enums.ReceiptStatus;
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

    @Transactional
    public Receipt create(ReceiptCreateDTO dto, User currentUser) {
        if (currentUser.getShop() == null) {
            throw new IllegalArgumentException("Bạn phải là chủ cửa hàng hoặc nhân viên của cửa hàng");
        }

        Receipt receipt = Receipt.builder().createdBy(currentUser).build();
        List<ReceiptItem> receiptItems = new ArrayList<>();
        List<Inventory> inventoriesToSave = new ArrayList<>();

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
                Optional<Inventory> opInventory = inventoryRepository.findByZone_IdAndProduct_Id(zone.getId(),
                        item.getProductId());

                Inventory inventory = null;
                if (opInventory.isPresent()) {
                    inventory = opInventory.get();
                    if (inventory.getProduct().getId() != item.getProductId()) {
                        throw new IllegalArgumentException("Sản phẩm không tồn tại trong kho");
                    }
                    Integer quantity = inventory.getQuantity() + item.getQuantity();
                    long startTime = System.currentTimeMillis(); // Lấy thời gian bắt đầu
                    long endTime = startTime + 5000; // Đặt thời gian kết thúc (5 giây)

                    while (System.currentTimeMillis() < endTime) {
                    }
                    inventory.setQuantity(quantity);
                } else {
                    inventory = Inventory.builder().zone(zone)
                            .product(productRepository.findById(item.getProductId())
                                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại")))
                            .quantity(item.getQuantity())
                            .createdBy(currentUser)
                            .build();
                }
                ReceiptItem receiptItem = ReceiptItem.builder().receipt(receipt).productId(item.getProductId())
                        .productName(inventory.getProduct().getName()).productPrice(inventory.getProduct().getPrice())
                        .quantity(item.getQuantity()).zoneId(item.getZoneId()).zoneName(zone.getName()).build();
                inventoriesToSave.add(inventory);
                receiptItems.add(receiptItem);
            }
        } catch (Exception e) {
            receipt.setStatus(ReceiptStatus.FAILED);
            System.out.println(e + " message: " + e.getMessage());
            throw new IllegalArgumentException("Lỗi khi tạo phiếu nhập: " + e.getMessage());
        }
        receipt.setStatus(ReceiptStatus.SUCCESS);
        receipt.setItems(receiptItems);
        receipt.setShop(currentUser.getShop());
        try {
            inventoryRepository.saveAll(inventoriesToSave);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new IllegalArgumentException("Dữ liệu đã bị thay đổi, vui lòng thử lại!");
        }
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
