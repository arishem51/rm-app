package com.example.backend.services;

import com.example.backend.dto.receipt.RequestReceiptDTO;
import com.example.backend.dto.receipt.ResponseReceiptDTO;
import com.example.backend.entities.Partner;
import com.example.backend.entities.Receipt;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.repositories.ReceiptRepository;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.repositories.PartnerRepository;
import com.example.backend.utils.UserRoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceiptService {
    
    private final ReceiptRepository receiptRepository;
    private final ShopRepository shopRepository;
    private final PartnerRepository partnerRepository;

    private void validateOwnerPermission(User user) {
        if (!UserRoleUtils.isOwner(user)) {
            throw new IllegalArgumentException("You are not authorized to manage receipts!");
        }
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to manage receipts!");
        }
    }

    private void validateUserBelongsToShop(Receipt receipt, User user) {
        if (!receipt.getShop().getId().equals(user.getShop().getId())) {
            throw new IllegalArgumentException("You can only access receipts from your own shop!");
        }
    }

    public Receipt createReceipt(RequestReceiptDTO dto, User user) {
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to create receipts!");
        }

        Shop shop = shopRepository.findById(dto.getShopId())
                .orElseThrow(() -> new IllegalArgumentException("Shop not found!"));

        Partner partner = Optional.ofNullable(dto.getPartnerId())
                .flatMap(partnerRepository::findById)
                .orElseGet(() -> partnerRepository.save(Partner.builder().name(dto.getPartnerName()).build()));

        Receipt receipt = Receipt.builder()
                .shop(shop)
                .partner(partner.getId() != null ? partner : null)
                .partnerName(partner.getId() == null ? partner.getName() : null)
                .createdBy(user)
                .products(dto.getProducts())
                .totalAmount(0)
                .build();

        return receiptRepository.save(receipt);
    }

    public Page<ResponseReceiptDTO> findReceipts(int page, int pageSize, User user) {
        if (user.getShop() == null) {
            throw new IllegalArgumentException("You must have a shop to view receipts!");
        }
        Page<Receipt> receipts = receiptRepository.findByShopId(user.getShop().getId(), PageRequest.of(page, pageSize));
        return receipts.map(ResponseReceiptDTO::fromEntity);
    }

    public List<ResponseReceiptDTO> findAllReceiptsFromShop(Long shopId, User user) {
        validateOwnerPermission(user);
        return receiptRepository.findByShopId(shopId)
                .stream()
                .map(ResponseReceiptDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Receipt updateReceipt(Long id, RequestReceiptDTO dto, User user) {
        validateOwnerPermission(user);
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found!"));

        validateUserBelongsToShop(receipt, user); // Kiểm tra xem Receipt có thuộc Shop của Owner không

        Partner partner = Optional.ofNullable(dto.getPartnerId())
                .flatMap(partnerRepository::findById)
                .orElseGet(() -> partnerRepository.save(Partner.builder().name(dto.getPartnerName()).build()));

        receipt.setPartner(partner.getId() != null ? partner : null);
        receipt.setPartnerName(partner.getId() == null ? partner.getName() : null);
        receipt.setProducts(dto.getProducts());
        receipt.setTotalAmount(receipt.getTotalAmount());

        return receiptRepository.save(receipt);
    }

    public void deleteReceipt(Long id, User user) {
        validateOwnerPermission(user);
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found!"));

        validateUserBelongsToShop(receipt, user); // Kiểm tra xem Receipt có thuộc Shop của Owner không

        receiptRepository.delete(receipt);
    }


    public ResponseReceiptDTO findReceiptById(Long id, User user) {
        Receipt receipt = receiptRepository.findByIdAndShopId(id, user.getShop().getId())
                .orElseThrow(() -> new IllegalArgumentException("Receipt not found!"));

        return ResponseReceiptDTO.fromEntity(receipt);
    }
}
