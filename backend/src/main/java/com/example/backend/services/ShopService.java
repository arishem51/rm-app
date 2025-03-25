package com.example.backend.services;

import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.dto.UpdateShopDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;

    public Page<Shop> findShops(int page, int pageSize, String search, User user) {
        if (user.getRole() == Role.ADMIN) {
            return search.isEmpty() ? shopRepository.findAll(PageRequest.of(page, pageSize))
                    : shopRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
        }
        throw new IllegalArgumentException("You are not authorized to perform this action.");
    }

    public Shop getShopById(Long id) {
        return shopRepository.findById(id).orElse(null);
    }

    // Kiem tra quyen so huu: Neu user khong phai chu cua hang, tu choi cap nhap
    // Cap nhat thong tin: Neu hop le, cap nhap ten & dia chi roi luu vao database
    public Shop updateShop(Long id, UpdateShopDTO shopDTO, User currentUser) {
        Optional<Shop> shopOpt = shopRepository.findById(id);
        if (shopOpt.isEmpty()) {
            throw new IllegalArgumentException("Shop does not exist.");
        }
        Shop shop = shopOpt.get();
        // Kiểm tra quyền cập nhật (chỉ Admin hoặc chính chủ shop)
        if (!currentUser.getRole().equals(Role.ADMIN) && !shop.getCreateBy().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this shop.");
        }
        // Cập nhật thông tin an toàn
        if (shopDTO.getName() != null) {
            shop.setName(shopDTO.getName());
        }
        if (shopDTO.getAddress() != null) {
            shop.setAddress(shopDTO.getAddress());
        }
        if (shopDTO.getBankAccount() != null) {
            shop.setBankAccount(shopDTO.getBankAccount());
        }
        if (shopDTO.getBankName() != null) {
            shop.setBankName(shopDTO.getBankName());
        }
        if (shopDTO.getPostalCode() != null) {
            shop.setPostalCode(shopDTO.getPostalCode());
        }
        if (shopDTO.getSocialMedia() != null) {
            shop.setSocialMedia(shopDTO.getSocialMedia());
        }
        if (shopDTO.getWebsite() != null) {
            shop.setWebsite(shopDTO.getWebsite());
        }
        return shopRepository.save(shop);
    }

    public Shop findShopById(Long id, User currentUser) {
        Optional<Shop> shopOpt = shopRepository.findById(id);
        if (shopOpt.isEmpty()) {
            throw new IllegalArgumentException("Shop does not exist.");
        }
        Shop shop = shopOpt.get();
        if (!currentUser.getRole().equals(Role.ADMIN) && !shop.getCreateBy().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to view this shop.");
        }
        return shop;
    }

}
