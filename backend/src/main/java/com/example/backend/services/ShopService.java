package com.example.backend.services;

import com.example.backend.dto.CreateShopDTO;
import com.example.backend.dto.ShopDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.enums.Role;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.dto.UpdateShopDTO;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final UserService userService;

    public Page<ShopDTO> findShops(int page, int pageSize, String search) {
        Page<Shop> shopPage = search.isEmpty() ? shopRepository.findAll(PageRequest.of(page, pageSize))
                : shopRepository.findByNameContainingIgnoreCase(search, PageRequest.of(page, pageSize));
        return shopPage.map(ShopDTO::fromEntity);
    }

    public Shop createShop(CreateShopDTO shopDTO, User user) throws IllegalArgumentException {
        User persistedUser = userService.findByUsername(user.getUsername());
        if (persistedUser == null) {
            throw new IllegalArgumentException("User not found.");
        }
        if (persistedUser.getRole() != Role.OWNER) {
            throw new IllegalArgumentException("Only owner can create shop.");
        }
        if (persistedUser.getShop() != null) {
            throw new IllegalArgumentException("This user already has a shop.");
        }
        if (shopRepository.existsByName(shopDTO.getName())) {
            throw new IllegalArgumentException("A shop with this name already exists.");
        }
        Set<User> users = new HashSet<>();
        users.add(persistedUser);
        Shop shop = Shop.builder()
                .name(shopDTO.getName())
                .address(shopDTO.getAddress())
                .createBy(
                        persistedUser)
                .users(users)
                .build();

        shopRepository.save(shop);
        userService.updateShop(persistedUser, shop);
        return shop;
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
        return shopRepository.save(shop);
    }

}
