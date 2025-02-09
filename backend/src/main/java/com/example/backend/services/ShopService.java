package com.example.backend.services;

import com.example.backend.dto.CreateShopDTO;
import com.example.backend.entities.Shop;
import com.example.backend.entities.User;
import com.example.backend.repositories.ShopRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    public Page<Shop> findShops(int page, int pageSize, String search) {
        return null;
    }

    public Shop createShop(CreateShopDTO shopDTO, User user) {
        if (shopRepository.existsByName(shopDTO.getName())) {
            return null;
        }

        Shop shop = Shop.builder()
                .name(shopDTO.getName())
                .address(shopDTO.getAddress())
                .createBy(user)
                .build();

        return shopRepository.save(shop);
    }

    public List<User> getStaffByShop(Long shopId) {
        return userRepository.findByShopId(shopId);  // Tìm tất cả users theo shopId
    }
    
    


}
