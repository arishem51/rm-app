package com.example.backend.services;

import com.example.backend.dto.CreateShopDTO;
import com.example.backend.dto.ShopDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.repositories.ShopRepository;
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

    public Shop createShop(CreateShopDTO shopDTO, User user) {
        User persistedUser = userService.findByUsername(user.getUsername());
        // This user already has a shop!
        if (shopRepository.existsByName(shopDTO.getName()) && persistedUser.getShop() != null) {
            return null;
        }
        Shop shop = Shop.builder()
                .name(shopDTO.getName())
                .address(shopDTO.getAddress())
                .createBy(
                        persistedUser)
                .build();

        shopRepository.save(shop);
        userService.updateShop(persistedUser, shop);
        return shop;
    }

    // public List<User> getStaffByShop(Long shopId) {
    // return userRepository.findByShopId(shopId); // Tìm tất cả users theo shopId
    // }

}
